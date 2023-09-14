import { AppInstall, AppUpgrade, Devvit, MultiTriggerDefinition } from '@devvit/public-api';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK, REDIS_KEY_AGE_TICK_JOB_ID, REDIS_KEY_WELFARE_TICK_JOB_ID, REDIS_KEY_KEITH, REDIS_KEY_WELFARE_TICK_BATCHES, REDIS_KEY_AGE_TICK_BATCHES } from './constants.js';
import { newSnoomiFormConfig } from './devvit/forms/newSnoomiForm.js';
import AppInstallOrUpgradeTrigger from './devvit/triggers/onAppInstallOrUpgrade.js';
import VirtualPetCustomPost from './components/VirtualPet.js';
import ScheduledJobTime from './devvit/jobs/welfareTickJob.js';
import ScheduledJobGrowth from './devvit/jobs/ageTickJob.js';

Devvit.configure({ redditAPI: true, kvStore: true });
Devvit.addSchedulerJob(ScheduledJobTime);
Devvit.addSchedulerJob(ScheduledJobGrowth);
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

Devvit.addCustomPostType(VirtualPetCustomPost);
Devvit.addTrigger(AppInstallOrUpgradeTrigger);

export default Devvit;
