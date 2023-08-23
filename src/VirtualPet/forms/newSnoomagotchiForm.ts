import { makeNewVirtualPet } from "../VirtualPet.js";
import { REDIS_KEY_AGE_TICK_BATCHES, REDIS_KEY_WELFARE_TICK_BATCHES } from "../constants.js";
import { FormConfig } from "./Form.js";

export const newSnoomagotchiFormConfig: FormConfig = {
  form: {
    title: "Create a new Snoomagotchi",
    description: "Use this form to create a brand new snoomagotchi woohoo",
    acceptLabel: "Hatch!",
    cancelLabel: "Cancel",
    fields: [
    {
      type: "string",
      name: "virtualPetName",
      label: "What Will Your Snoomagotchi's Name Be?",
      helpText: "Snoomagotchi are genderless. We reserve the right to destroy Snoomagotchi that have inappropriate or offensive names.",
      required: true,
    },
    {
      type: "select",
      name: "eggNumber",
      label: "Pick Your Egg",
      helpText: "The system has generated three unique genotypes for you to select from.",
      required: true,
      options: [
        {
          label: "Egg #1",
          value: "1",
        },
        {
          label: "Egg #2",
          value: "2",
          },
          {
          label: "Egg #3",
          value: "3",
          }
      ]
      },
      {
        type: "boolean",
        name: "funMode",
        label: "Enable Fun Mode",
        helpText: "Fun-Mode Snoomagotchi cannot die, cannot breed, and do not contribute to population metrics. You may have up to three fun-mode Snoomagotchi."
      }
    ]
  },

  handler: async (event, context) => {
    const virtualPetName = event.values["virtualPetName"] as string;
    const eggNumber = event.values["eggNumber"] as number;
    const funMode = event.values["funMode"] as boolean;
  
    const owner = await context.reddit.getCurrentUser();
    const virtualPet = makeNewVirtualPet(virtualPetName, owner.username);
  
    const subreddit = await context.reddit.getCurrentSubreddit();
    const post = await context.reddit.submitPost({
      title: `${owner.username}'s Snoomagotchi, ${virtualPetName}`,
      subredditName: subreddit.name,
      preview: `Loading ${owner.username}'s Snoomagotchi...`
    });
  
    await context.kvStore.put(post.id, virtualPet);
  
    const now = new Date();
  
    let TimeBatches = await context.kvStore.get<string[][]>(REDIS_KEY_WELFARE_TICK_BATCHES);
    if (TimeBatches === undefined) {
      throw new Error("TimeBatch record has not been created");
    }
  
    // age tick happens once per minute, and all ids in GrowthBatches[minute] will be ticked.
    // each pet ticks once per hour
    TimeBatches[now.getMinutes()].push(post.id);
    await context.kvStore.put(REDIS_KEY_WELFARE_TICK_BATCHES, TimeBatches);
  
    let GrowthBatches = await context.kvStore.get<string[][]>(REDIS_KEY_AGE_TICK_BATCHES);
    if (GrowthBatches === undefined) {
      throw new Error("GrowthBatch record has not been created");
    }
  
    // age tick happens once per hour, and all ids in GrowthBatches[hour] will be ticked.
    // each pet gets aged once per day
    GrowthBatches[now.getHours()].push(post.id);
    await context.kvStore.put(REDIS_KEY_AGE_TICK_BATCHES, GrowthBatches);
  
    context.ui.showToast(`Created a ${funMode ? "new fun-mode" : "new" } virtual pet, ${virtualPetName}, in age batch ${now.getHours()} and welfare batch ${now.getMinutes()} for ${owner.username} from egg #${eggNumber}. How eggciting!`);
  }
};
