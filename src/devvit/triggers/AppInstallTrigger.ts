import {
  AppInstall,
  AppInstallDefinition,
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
} from "../../constants.js";
import { VirtualPet, makeNewVirtualPet } from "../../VirtualPet.js";
import { sparseArray } from "../../utilities.js";

const onAppInstall: TriggerOnEventHandler<TriggerEventType[AppInstall]> = async (_, context) => {
    // The age tickover happens once per hour.
    // During each tickover, a batch of virtual pets (determined by the hour of birth) is ticked over.
    // Each virtual pet has its age ticked over once per day using this mechanism.
    let GrowthSchedulerJob = await context.kvStore.get<string>(REDIS_KEY_AGE_TICK_JOB_ID);
    if (GrowthSchedulerJob === undefined) {
      console.warn("No age tick scheduler job is configured. Creating one now.");
      GrowthSchedulerJob = await context.scheduler.runJob({
        name: SCHEDULER_JOB_AGE_TICK,
        cron: "0 * * * *"
      });
      await context.kvStore.put(REDIS_KEY_AGE_TICK_JOB_ID, GrowthSchedulerJob);
    }
    console.log(`Age tick scheduler job is ${GrowthSchedulerJob}`);

    // The welfare tickover happens once per minute.
    // During each tickover, a batch of virtual pets (determined by the minute-past-the-hour of birth) is ticked over.
    // Each virtual pet has its welfare ticked over once per hour using this mechanism.
    let TimeSchedulerJob = await context.kvStore.get<string>(REDIS_KEY_WELFARE_TICK_JOB_ID);
    if (TimeSchedulerJob === undefined) {
      console.warn("No welfare tick scheduler job is configured. Creating one now.")
      TimeSchedulerJob = await context.scheduler.runJob({
        name: SCHEDULER_JOB_WELFARE_TICK,
        cron: "* * * * *"
      });
      await context.kvStore.put(REDIS_KEY_WELFARE_TICK_JOB_ID, TimeSchedulerJob)
    }
    console.log(`Welfare tick scheduler job is ${TimeSchedulerJob}`);;

    // The default virtual pet, Keith, exists to support local testing.
    // It is recalled in Devvit Studio when viewing the custom post tab.
    let keith = await context.kvStore.get<VirtualPet>(REDIS_KEY_KEITH);
    if (keith === undefined) {
      // TODO: How do we make VirtualPet conform to JSONObject
      keith = makeNewVirtualPet('Keith', 'The Computer');
      await context.kvStore.put(REDIS_KEY_KEITH, keith);
    }

    // record of virtual pet ids organised by minute of birth
    let TimeBatches = await context.kvStore.get<string[][]>(REDIS_KEY_WELFARE_TICK_BATCHES);
    if (TimeBatches === undefined) {
      TimeBatches = sparseArray<string[]>(60, []);
      await context.kvStore.put(REDIS_KEY_WELFARE_TICK_BATCHES, TimeBatches);
    }

    // record of virtual pet ids organised by hour of birth
    let GrowthBatches = await context.kvStore.get<string[][]>(REDIS_KEY_AGE_TICK_BATCHES);
    if (GrowthBatches === undefined) {
      GrowthBatches = sparseArray<string[]>(24, []);
      await context.kvStore.put(REDIS_KEY_AGE_TICK_BATCHES, GrowthBatches);
    }
}

const AppInstallTrigger: AppInstallDefinition = {
  event: 'AppInstall',
  onEvent: onAppInstall
};

export default AppInstallTrigger;
