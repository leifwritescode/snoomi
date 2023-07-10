import { Devvit } from '@devvit/public-api';
import VirtualPetRoot from './VirtualPet/index.js';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK } from './VirtualPet/constants.js';

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

const formKeyNewSnoomagotchi = Devvit.createForm({
  title: "Create a new Snoomagotchi",
  description: "Use this form to create a brand new snoomagotchi woohoo",
  acceptLabel: "Hatch",
  cancelLabel: "Abandon",
  fields: [
    {
      type: "string",
      name: "virtualPetName",
      label: "Snoomagotchi's Name",
      required: true,
    }
  ]
},
(event, context) => {
  const virtualPetName = event.values["virtualPetName"] as string;

  context.ui.showToast(`the new virtual pet is called ${virtualPetName}`);
});

Devvit.addMenuItem({
  label: "Create My Snoomagotchi!",
  description: "Create a new Snoomagotchi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["member", "moderator"],
  onPress: (_, context) => context.ui.showForm(formKeyNewSnoomagotchi)
});

Devvit.addCustomPostType({
  name: 'VirtualPet',
  render: (props) => <VirtualPetRoot {...props} />,
});

export default Devvit;
