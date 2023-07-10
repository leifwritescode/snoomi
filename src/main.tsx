import { Devvit } from '@devvit/public-api';
import VirtualPetRoot from './VirtualPet/index.js';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK } from './VirtualPet/constants.js';
import { newSnoomagotchiForm, newSnoomagotchiFormSubmitHandler } from './VirtualPet/forms/newSnoomagotchiForm.js';

Devvit.configure({
  redditAPI: true,
  kvStore: true,
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_WELFARE_TICK,
  onRun: (e) => {
    // todo snoomagotchi welfare tick
  }
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_AGE_TICK,
  onRun: (e) => {
    // todo snoomagotchi age tick
  }
});

const formKeyNewSnoomagotchi = Devvit.createForm(newSnoomagotchiForm, newSnoomagotchiFormSubmitHandler);

Devvit.addMenuItem({
  label: "Create My Snoomagotchi!",
  description: "Create a new Snoomagotchi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["member"],
  onPress: (_, context) => context.ui.showForm(formKeyNewSnoomagotchi)
});

Devvit.addCustomPostType({
  name: 'VirtualPet',
  render: (props) => <VirtualPetRoot {...props} />,
});

export default Devvit;
