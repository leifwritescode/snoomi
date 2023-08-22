import { Devvit } from '@devvit/public-api';
import VirtualPetRoot from './VirtualPet/index.js';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK, REDIS_KEY_AGE_TICK_JOB_ID, REDIS_KEY_WELFARE_TICK_JOB_ID, REDIS_KEY_KEITH, REDIS_KEY_WELFARE_TICK_BATCHES, REDIS_KEY_AGE_TICK_BATCHES } from './VirtualPet/constants.js';
import { newSnoomagotchiFormConfig } from './VirtualPet/forms/newSnoomagotchiForm.js';
import welfareTickJob from './VirtualPet/jobs/welfareTickJob.js';
import ageTickJob from './VirtualPet/jobs/ageTickJob.js';
import onAppInstallOrUpgrade from './VirtualPet/triggers/onAppInstallOrUpgrade.js';

Devvit.configure({
  redditAPI: true,
  kvStore: true,
  http: true,
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_WELFARE_TICK,
  onRun: welfareTickJob
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_AGE_TICK,
  onRun: ageTickJob
});

const formKeyNewSnoomagotchi = Devvit.createForm(newSnoomagotchiFormConfig.form, newSnoomagotchiFormConfig.handler);

Devvit.addMenuItem({
  label: "DEVMODE: Create My Snoomagotchi!",
  description: "Create a new Snoomagotchi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["moderator"],
  onPress: (_, context) => context.ui.showForm(formKeyNewSnoomagotchi)
});

Devvit.addMenuItem({
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
});

Devvit.addCustomPostType({
  name: 'VirtualPet',
  render: (props) => (
    <blocks height="tall">
      <VirtualPetRoot {...props} />
    </blocks>
  ),
});

Devvit.addTrigger({
  events: [ 'AppInstall', 'AppUpgrade' ],
  onEvent: onAppInstallOrUpgrade
});

export default Devvit;
