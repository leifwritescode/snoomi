import { Devvit } from '@devvit/public-api';
import VirtualPetRoot from './VirtualPet/index.js';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK, REDIS_KEY_AGE_TICK_JOB_ID, REDIS_KEY_WELFARE_TICK_JOB_ID, REDIS_KEY_KEITH } from './VirtualPet/constants.js';
import { newSnoomagotchiForm, newSnoomagotchiFormSubmitHandler } from './VirtualPet/forms/newSnoomagotchiForm.js';
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

const formKeyNewSnoomagotchi = Devvit.createForm(newSnoomagotchiForm, newSnoomagotchiFormSubmitHandler);

Devvit.addMenuItem({
  label: "DEVMODE: Create My Snoomagotchi!",
  description: "Create a new Snoomagotchi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["moderator"],
  onPress: (_, context) => context.ui.showForm(formKeyNewSnoomagotchi)
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
