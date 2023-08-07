import { ScheduledJobHandler } from "@devvit/public-api";
import { clamp } from "../utilities.js";
import { VirtualPet } from "../VirtualPet.js";
import { REDIS_KEY_WELFARE_TICK_BATCHES } from "../constants.js";

const welfareTickJob: ScheduledJobHandler = async (e, { kvStore }) => {
  const batches = await kvStore.get<string[][]>(REDIS_KEY_WELFARE_TICK_BATCHES);
  if (batches === undefined) {
    console.log("No welfare batches are configured.");
    return;
  }

  const now = new Date();
  console.log(`Begin processing welfare tick batch H+${now.getMinutes()} (Time is ${now}))`);

  const keys = batches[now.getMinutes()];
  if (keys.length === 0) {
    console.log("No pets to process.");
    return;
  }

  for (const key of keys) {
    let value = await kvStore.get<string>(key);
    if (value === undefined) {
      continue;
    }

    const virtualPet = JSON.parse(value) as VirtualPet;
    virtualPet.state.hunger = clamp(virtualPet.state.hunger - 10, 0, 100);
    virtualPet.state.happiness = clamp(virtualPet.state.happiness - 10, 0, 100);
    virtualPet.state.discipline = clamp(virtualPet.state.discipline - 5, 0, 100);

    value = JSON.stringify(virtualPet);
    await kvStore.put(key, value);
  }

  console.log(`Finished processing ${keys.length} pets in batch H+${now.getMinutes()}.`);
}

export default welfareTickJob;
