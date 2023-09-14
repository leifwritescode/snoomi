import { ScheduledJobHandler } from "@devvit/public-api";
import { VirtualPet } from "../VirtualPet.js";
import { REDIS_KEY_AGE_TICK_BATCHES } from "../constants.js";
import { reduce } from "../Simulation/index.js";
import { Influences } from "../Simulation/Influences.js";

const GrowthJob: ScheduledJobHandler = async (_, { kvStore }) => {
  const batches = await kvStore.get<string[][]>(REDIS_KEY_AGE_TICK_BATCHES);
  if (batches === undefined) {
    console.log("No age batches are configured.");
    return;
  }

  const now = new Date();
  console.log(`Begin processing age tick batch D+${now.getHours()} (Time is ${now}))`);

  const pets = batches[now.getHours()];
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

    virtualPet.state = reduce(virtualPet.state, { with: Influences.Growth });

    await kvStore.put(pet, virtualPet);
  }

  console.log(`Finished processing ${pets.length} pets in batch D+${now.getHours()}.`);
}

export default GrowthJob;
