import { Devvit } from '@devvit/public-api-next';
import VirtualPetRoot from './VirtualPet/index.js';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK } from './VirtualPet/constants.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
  scheduler: true
});

Devvit.addScheduledJobType({
  name: SCHEDULER_JOB_WELFARE_TICK,
  onRun: (e) => {
    // todo snoomagotchi welfare tick
  }
});

Devvit.addScheduledJobType({
  name: SCHEDULER_JOB_AGE_TICK,
  onRun: (e) => {
    // todo snoomagotchi age tick
  }
});

Devvit.addMenuItem({
  label: "Create My Snoomagotchi!",
  description: "Create a new Snoomagotchi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["member", "moderator"],
  onPress: (e) => {
    // todo display form, collect response, create snoomagotchi
  }
});

Devvit.addCustomPostType({
  name: 'VirtualPet',
  render: (props) => <VirtualPetRoot {...props} />,
});

export default Devvit;
