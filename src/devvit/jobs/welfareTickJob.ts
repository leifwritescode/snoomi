import { ScheduledJobHandler, ScheduledJobType } from "@devvit/public-api";
import { VirtualPet } from "../../VirtualPet.js";
import { REDIS_KEY_WELFARE_TICK_BATCHES, SCHEDULER_JOB_WELFARE_TICK } from "../../constants.js";
import { reduce } from "../../simulation/index.js";
import { Influences } from "../../simulation/Influences.js";

const schedulerJobTime: ScheduledJobHandler = async (_, { kvStore }) => {
  const batches = await kvStore.get<string[][]>(REDIS_KEY_WELFARE_TICK_BATCHES);
  if (batches === undefined) {
    console.log("No welfare batches are configured.");
    return;
  }

  const now = new Date();
  console.log(`Begin processing welfare tick batch H+${now.getMinutes()} (Time is ${now}))`);

  const pets = batches[now.getMinutes()];
  if (pets.length === 0) {
    console.warn("No pets to process.");
    return;
  }

  for (const pet of pets) {
    let virtualPet = await kvStore.get<VirtualPet>(pet);
    if (virtualPet === undefined) {
      console.warn(`Pet ${pet} not found.`);
      continue;
    }

    virtualPet.state = reduce(virtualPet.state, {
      with: Influences.Time,
      hunger: 10,
      happiness: 10,
      discipline: 5,
    });

    await kvStore.put(pet, virtualPet);
  }

  console.log(`Finished processing ${pets.length} pets in batch H+${now.getMinutes()}.`);
}

const ScheduledJobTime: ScheduledJobType = {
  name: SCHEDULER_JOB_WELFARE_TICK,
  onRun: schedulerJobTime
};

export default ScheduledJobTime;
