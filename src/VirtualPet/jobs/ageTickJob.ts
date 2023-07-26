import { ScheduledJobHandler } from "@devvit/public-api";
import { VirtualPet } from "../VirtualPet.js";

const ageTickJob: ScheduledJobHandler = async (_, { kvStore }) => {
  console.log("age tickover");
  const keys = await kvStore.list();
  for (const key of keys) {
    let value = await kvStore.get<string>(key);
    if (value === undefined) {
      continue;
    }

    const virtualPet = JSON.parse(value) as VirtualPet;
    virtualPet.age++;

    value = JSON.stringify(virtualPet);
    await kvStore.put(key, value);
  }
}

export default ageTickJob;
