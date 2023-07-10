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
(event, context) => {
  const virtualPetName = event.values["virtualPetName"] as string;
  const eggNumber = event.values["eggNumber"] as number;
  const funMode = event.values["funMode"] as boolean;

  // todo generate genotype, virtualpet structure, make the post, populate kv store

  context.ui.showToast(`the new virtual pet is called ${virtualPetName}, it has egg ${eggNumber} and funMode=${funMode}`);
});

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
