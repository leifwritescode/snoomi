import { Devvit } from '@devvit/public-api';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK, REDIS_KEY_AGE_TICK_JOB_ID, REDIS_KEY_WELFARE_TICK_JOB_ID, REDIS_KEY_KEITH, REDIS_KEY_WELFARE_TICK_BATCHES, REDIS_KEY_AGE_TICK_BATCHES } from './constants.js';
import { newSnoomiFormConfig } from './forms/newSnoomiForm.js';
import TimeJob from './jobs/welfareTickJob.js';
import GrowthJob from './jobs/ageTickJob.js';
import onAppInstallOrUpgrade from './triggers/onAppInstallOrUpgrade.js';
import VirtualPet from './components/VirtualPet.js';

Devvit.configure({
  redditAPI: true,
  kvStore: true,
  http: true,
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_WELFARE_TICK,
  onRun: TimeJob
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_AGE_TICK,
  onRun: GrowthJob
});

const formKeyNewSnoomi = Devvit.createForm(newSnoomiFormConfig.form, newSnoomiFormConfig.handler);

Devvit.addMenuItem({
  label: "DEVMODE: Create My Snoomi!",
  description: "Create a new Snoomi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["moderator"],
  onPress: (_, context) => context.ui.showForm(formKeyNewSnoomi)
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
  render: (context) => <VirtualPet { ...context } />
});

Devvit.addTrigger({
  events: [ 'AppInstall', 'AppUpgrade' ],
  onEvent: onAppInstallOrUpgrade
});

export default Devvit;
