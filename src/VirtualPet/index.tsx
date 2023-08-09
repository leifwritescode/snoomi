import { CustomPostType, KVStore } from "@devvit/public-api";
import { ViewStateName, initialViewState, reduce } from "./types/ViewState.js";
import { VirtualPetComponentContext } from "./types/VirtualPetComponent.js";
import { REDIS_KEY_KEITH } from "./constants.js";
import { VirtualPet, makeNewVirtualPet } from "./VirtualPet.js";
import { Devvit } from "@devvit/public-api";
import VirtualPetView from "./views/VirtualPetView.js";
import MealSelectView from "./views/MealSelectView.js";
import FinishedMealView from "./views/FinishedMealView.js";
import ActivitySelectView from "./views/ActivitySelectView.js";
import FinishedActivityView from "./views/FinishedActivityView.js";

const refreshVirtualPet = async (key: string, kvStore: KVStore) : Promise<VirtualPet> => {
  let virtualPet = await kvStore.get<VirtualPet>(key);
  if (virtualPet === undefined) {
    virtualPet = makeNewVirtualPet("Keith", "The Computer");
  }
  return virtualPet;
}

const VirtualPetRoot: CustomPostType["render"] = (context) => {
  const redisKeyVirtualPetState = context.postId ?? REDIS_KEY_KEITH;
  const [viewState, setViewState] = context.useState(initialViewState());
  const [virtualPet, setVirtualPet] = context.useState(async () => {
    return await refreshVirtualPet(redisKeyVirtualPetState, context.kvStore)
  });
  const [isServerCall, setIsServerCall] = context.useState(false);

  // this shouldn't need to do any fancy server stuff as it happens between draws
  const interval = context.useInterval(async () => {
    const virtualPet = await refreshVirtualPet(redisKeyVirtualPetState, context.kvStore);
    setVirtualPet(virtualPet);
  }, 60000);
  interval.start();

  const virtualPetComponentContext: VirtualPetComponentContext = {
    ...context, 
    getVirtualPet: () => virtualPet,
    setVirtualPet: (virtualPet) => {
      context.kvStore.put(redisKeyVirtualPetState, virtualPet);
      setVirtualPet(virtualPet);
    },
    getViewState: () => viewState,
    setViewState: (action) => {
      console.log(`attempting to action ${action.name} on ${viewState.name}`);
      const reducedState = reduce(viewState, action);
      console.log(`newly reduced state is ${reducedState.name}`);
      setViewState(reducedState);
    },
    onServer: (delegate) => {
      try {
        delegate();
        setIsServerCall(false);
      }
      catch (e) {
        if ((e as Error).message === "ServerCallRequired") {
          console.log("needs server call!");
          setIsServerCall(true);
        } else {
          console.log("some other error");
          throw e;
        }
      }
    },
    getIsServerCall: () => isServerCall,
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
