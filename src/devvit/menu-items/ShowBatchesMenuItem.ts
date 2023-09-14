import { MenuItem } from "@devvit/public-api";
import { REDIS_KEY_WELFARE_TICK_BATCHES, REDIS_KEY_AGE_TICK_BATCHES } from "../../constants.js";

const ShowBatchesMenuItem: MenuItem = {
  label: "DEVMODE: Show Batches in Logs",
  description: "Iterates through the kv store batch records and logs them.",
  location: "subreddit",
  forUserType: ["moderator"],
  onPress: async (_, context) => {
    const welfareBatches = await context.kvStore.get<string[][]>(REDIS_KEY_WELFARE_TICK_BATCHES);
    if (welfareBatches !== undefined) {
      console.log("-=- Welfare Batches -=-");
      console.log(welfareBatches);
      welfareBatches.forEach((e, i) => {
        console.log(`H+${i}: ${e.join(', ')}`);
      });
    } else {
      console.log("No welfare batches found.");
    }

    const ageBatches = await context.kvStore.get<string[][]>(REDIS_KEY_AGE_TICK_BATCHES);
    if (ageBatches !== undefined) {
      console.log("-=- Age Batches -=-");
      ageBatches.forEach((e, i) => {
        console.log(`D+${i}: ${e.join(', ')}`);
      });
    } else {
      console.log("No age batches found.");
    }
  }
};

export default ShowBatchesMenuItem;
