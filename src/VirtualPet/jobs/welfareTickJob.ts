import { ScheduledJobHandler } from "@devvit/public-api";
import { clamp } from "../utilities.js";

const welfareTickJob: ScheduledJobHandler = async (_, { kvStore }) => {
  console.log("welfare tickover");
  const keys = await kvStore.list();
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
}

export default welfareTickJob;
