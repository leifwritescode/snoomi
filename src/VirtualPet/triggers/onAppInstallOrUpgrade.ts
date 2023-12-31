import {
  AppInstall,
  AppUpgrade,
  TriggerEventType,
  TriggerOnEventHandler
} from "@devvit/public-api";
import {
  REDIS_KEY_AGE_TICK_JOB_ID,
  REDIS_KEY_WELFARE_TICK_JOB_ID,
  SCHEDULER_JOB_AGE_TICK,
  SCHEDULER_JOB_WELFARE_TICK,
  REDIS_KEY_KEITH,
  REDIS_KEY_WELFARE_TICK_BATCHES,
  REDIS_KEY_AGE_TICK_BATCHES
} from "../constants.js";
import { VirtualPet, makeNewVirtualPet } from "../VirtualPet.js";
import { sparseArray } from "../utilities.js";

const onAppInstallOrUpgrade: TriggerOnEventHandler<TriggerEventType[AppInstall] | TriggerEventType[AppUpgrade]> = async (_, context) => {
    // The age tickover happens once per hour.
    // During each tickover, a batch of virtual pets (determined by the hour of birth) is ticked over.
    // Each virtual pet has its age ticked over once per day using this mechanism.
    let ageTickSchedulerJob = await context.kvStore.get<string>(REDIS_KEY_AGE_TICK_JOB_ID);
    if (ageTickSchedulerJob === undefined) {
      console.warn("No age tick scheduler job is configured. Creating one now.");
      ageTickSchedulerJob = await context.scheduler.runJob({
        name: SCHEDULER_JOB_AGE_TICK,
        cron: "0 * * * *"
      });
      await context.kvStore.put(REDIS_KEY_AGE_TICK_JOB_ID, ageTickSchedulerJob);
    }
    console.log(`Age tick scheduler job is ${ageTickSchedulerJob}`);

    // The welfare tickover happens once per minute.
    // During each tickover, a batch of virtual pets (determined by the minute-past-the-hour of birth) is ticked over.
    // Each virtual pet has its welfare ticked over once per hour using this mechanism.
    let welfareTickSchedulerJob = await context.kvStore.get<string>(REDIS_KEY_WELFARE_TICK_JOB_ID);
    if (welfareTickSchedulerJob === undefined) {
      console.warn("No welfare tick scheduler job is configured. Creating one now.")
      welfareTickSchedulerJob = await context.scheduler.runJob({
        name: SCHEDULER_JOB_WELFARE_TICK,
        cron: "* * * * *"
      });
      await context.kvStore.put(REDIS_KEY_WELFARE_TICK_JOB_ID, welfareTickSchedulerJob)
    }
    console.log(`Welfare tick scheduler job is ${welfareTickSchedulerJob}`);;

    // The default virtual pet, Keith, exists to support local testing.
    // It is recalled in Devvit Studio when viewing the custom post tab.
    let keith = await context.kvStore.get<VirtualPet>(REDIS_KEY_KEITH);
    if (keith === undefined) {
      // TODO: How do we make VirtualPet conform to JSONObject
      keith = makeNewVirtualPet('Keith', 'The Computer');
      await context.kvStore.put(REDIS_KEY_KEITH, keith);
    }

    // record of virtual pet ids organised by minute of birth
    let welfareTickBatches = await context.kvStore.get<string[][]>(REDIS_KEY_WELFARE_TICK_BATCHES);
    if (welfareTickBatches === undefined) {
      welfareTickBatches = sparseArray<string[]>(60, []);
      await context.kvStore.put(REDIS_KEY_WELFARE_TICK_BATCHES, welfareTickBatches);
    }

    // record of virtual pet ids organised by hour of birth
    let ageTickBatches = await context.kvStore.get<string[][]>(REDIS_KEY_AGE_TICK_BATCHES);
    if (ageTickBatches === undefined) {
      ageTickBatches = sparseArray<string[]>(24, []);
      await context.kvStore.put(REDIS_KEY_AGE_TICK_BATCHES, ageTickBatches);
    }
}

export default onAppInstallOrUpgrade;
