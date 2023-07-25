import { Devvit } from '@devvit/public-api';
import VirtualPetRoot from './VirtualPet/index.js';
import { SCHEDULER_JOB_WELFARE_TICK, SCHEDULER_JOB_AGE_TICK, REDIS_KEY_AGE_TICK_JOB_ID, REDIS_KEY_WELFARE_TICK_JOB_ID, REDIS_KEY_KEITH } from './VirtualPet/constants.js';
import { newSnoomagotchiForm, newSnoomagotchiFormSubmitHandler } from './VirtualPet/forms/newSnoomagotchiForm.js';
import { VirtualPet, makeNewVirtualPet } from './VirtualPet/VirtualPet.js';

Devvit.configure({
  redditAPI: true,
  kvStore: true,
  http: true,
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_WELFARE_TICK,
  onRun: async (_, {kvStore}) => {
    console.log("welfare tickover");
    const keys = await kvStore.list();
    for (const key of keys) {
      let value = await kvStore.get<string>(key);
      if (value === undefined) {
        continue;
      }

      const virtualPet = JSON.parse(value) as VirtualPet;
      virtualPet.state.hunger -= 10;
      virtualPet.state.happiness -= 10;
      virtualPet.state.discipline -= 5;

      value = JSON.stringify(virtualPet);
      await kvStore.put(key, value);
    }
  }
});

Devvit.addSchedulerJob({
  name: SCHEDULER_JOB_AGE_TICK,
  onRun: async (_, {kvStore}) => {
    console.log("age tickover");
    const keys = await kvStore.list();
    for (const key of keys) {
      let value = await kvStore.get<string>(key);
      if (value === undefined) {
        continue;
      }

      const virtualPet = JSON.parse(value) as VirtualPet;
      virtualPet.age++;

      value = JSON.stringify(virtualPet);
      await kvStore.put(key, value);
    }
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
  render: (props) => (
    <blocks height="tall">
      <VirtualPetRoot {...props} />
    </blocks>
  ),
});

Devvit.addTrigger({
  events: [ 'AppInstall', 'AppUpgrade' ],
  onEvent: async (_, context) => {
    // The age tickover happens once per hour.
    // During each tickover, a batch of virtual pets (determined by the hour of birth) is ticked over.
    // Each virtual pet has its age ticked over once per day using this mechanism.
    let ageTickSchedulerJob = await context.kvStore.get<string>(REDIS_KEY_AGE_TICK_JOB_ID);
    if (ageTickSchedulerJob === undefined) {
      ageTickSchedulerJob = await context.scheduler.runJob({
        name: SCHEDULER_JOB_AGE_TICK,
        cron: "0 * * * *"
      });
      await context.kvStore.put(REDIS_KEY_AGE_TICK_JOB_ID, ageTickSchedulerJob);
    }

    // The welfare tickover happens once per minute.
    // During each tickover, a batch of virtual pets (determined by the minute-past-the-hour of birth) is ticked over.
    // Each virtual pet has its welfare ticked over once per hour using this mechanism.
    let welfareTickSchedulerJob = await context.kvStore.get<string>(REDIS_KEY_WELFARE_TICK_JOB_ID);
    if (welfareTickSchedulerJob === undefined) {
      welfareTickSchedulerJob = await context.scheduler.runJob({
        name: SCHEDULER_JOB_WELFARE_TICK,
        cron: "* * * * *"
      });
      await context.kvStore.put(REDIS_KEY_WELFARE_TICK_JOB_ID, welfareTickSchedulerJob)
    }

    // The default virtual pet, Keith, exists to support local testing.
    // It is recalled in Devvit Studio when viewing the custom post tab.
    let keith = await context.kvStore.get<string>(REDIS_KEY_KEITH);
    if (keith === undefined) {
      // TODO: How do we make VirtualPet conform to JSONObject
      keith = JSON.stringify(makeNewVirtualPet('Keith', 'The Computer'));
      await context.kvStore.put(REDIS_KEY_KEITH, keith);
    }

    // TODO: initialise batch records
  }
});

export default Devvit;
