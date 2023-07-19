import { CustomPostType, KVStore } from "@devvit/public-api";
import { ViewAction, ViewStateName, initialViewState, reduce } from "./types/ViewState.js";
import { VirtualPetComponentContext } from "./types/VirtualPetComponent.js";
import { REDIS_KEY_KEITH } from "./constants.js";
import { VirtualPet, makeNewVirtualPet } from "./VirtualPet.js";
import { Devvit } from "@devvit/public-api";
import VirtualPetView from "./views/VirtualPetView.js";
import MealSelectView from "./views/MealSelectView.js";
import FinishedMealView from "./views/FinishedMealView.js";
import ActivitySelectView from "./views/ActivitySelectView.js";
import FinishedActivityView from "./views/FinishedActivityView.js";

const refreshVirtualPet = async (key: string, kvStore: KVStore) : VirtualPet => {
  let virtualPet = await kvStore.get<string>(key);
  if (virtualPet === undefined) {
    virtualPet = JSON.stringify(makeNewVirtualPet("Keith", "The Computer"));
  }
  return JSON.parse(virtualPet) as VirtualPet;
}

const VirtualPetRoot: CustomPostType["render"] = (context) => {
  const redisKeyVirtualPetState = context.postId ?? REDIS_KEY_KEITH;
  const [viewState, setViewState] = context.useState(initialViewState());
  const [virtualPet, setVirtualPet] = context.useState(refreshVirtualPet(redisKeyVirtualPetState, context.kvStore));
  const interval = context.useInterval(() => {
    const virtualPet = refreshVirtualPet(redisKeyVirtualPetState, context.kvStore);
    setVirtualPet(virtualPet);
  }, 60000);
  interval.start();

  const virtualPetComponentContext: VirtualPetComponentContext = {
    ...context, 
    getVirtualPet: () => virtualPet,
    setVirtualPet: (virtualPet: VirtualPet) => {
      context.kvStore.put(redisKeyVirtualPetState, JSON.stringify(virtualPet));
      setVirtualPet(virtualPet);
    },
    getViewState: () => viewState,
    setViewState: (action: ViewAction) => {
      console.log(`attempting to action ${action.name} on ${viewState.name}`);
      const reducedState = reduce(viewState, action);
      console.log(`newly reduced state is ${reducedState.name}`);
      setViewState(reducedState);
    }
  };

  switch (viewState.name) {
    case ViewStateName.VirtualPet:
      return (<VirtualPetView { ...virtualPetComponentContext} />);
    case ViewStateName.MealSelect:
      return (<MealSelectView { ...virtualPetComponentContext} />);
    case ViewStateName.FinishedMeal:
      return (<FinishedMealView { ...virtualPetComponentContext } />);
    case ViewStateName.ActivitySelect:
      return (<ActivitySelectView { ...virtualPetComponentContext } />);
    case ViewStateName.FinishedActivity:
      return (<FinishedActivityView { ...virtualPetComponentContext } />);
  }
}

export default VirtualPetRoot;
