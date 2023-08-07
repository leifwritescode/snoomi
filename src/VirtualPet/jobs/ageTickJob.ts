import { ScheduledJobHandler } from "@devvit/public-api";
import { VirtualPet } from "../VirtualPet.js";
import { REDIS_KEY_AGE_TICK_BATCHES } from "../constants.js";

const ageTickJob: ScheduledJobHandler = async (_, { kvStore }) => {
  const batches = await kvStore.get<string[][]>(REDIS_KEY_AGE_TICK_BATCHES);
  if (batches === undefined) {
    console.log("No age batches are configured.");
    return;
  }

  const now = new Date();
  console.log(`Begin processing age tick batch D+${now.getHours()} (Time is ${now}))`);

  const pets = batches[now.getHours()];
  if (pets.length === 0) {
    console.log("No pets to process.");
    return;
  }

  for (const pet of pets) {
    let value = await kvStore.get<string>(pet);
    if (value === undefined) {
      continue;
    }

    const virtualPet = JSON.parse(value) as VirtualPet;
    virtualPet.age++;

    value = JSON.stringify(virtualPet);
    await kvStore.put(pet, value);
  }

  console.log(`Finished processing ${pets.length} pets in batch D+${now.getHours()}.`);
}

export default ageTickJob;
