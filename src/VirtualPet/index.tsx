import { CustomPostType } from "@devvit/public-api";
import { Home, ViewAction, ViewStateName, initialViewState, reduce } from "./types/ViewState.js";
import { VirtualPetComponentContext } from "./types/VirtualPetComponent.js";
import { REDIS_KEY_KEITH } from "./constants.js";
import { VirtualPet, makeNewVirtualPet } from "./VirtualPet.js";
import { Devvit } from "@devvit/public-api";
import virtualPetView from "./views/virtualPetView.js";

const VirtualPetRoot: CustomPostType["render"] = (context) => {
  const redisKeyVirtualPetState = context.postId ?? REDIS_KEY_KEITH;
  const [viewState, setViewState] = context.useState(initialViewState());
  const [virtualPet, setVirtualPet] = context.useState(async () => {
    let virtualPet = await context.kvStore.get<string>(redisKeyVirtualPetState);
    if (virtualPet === undefined) {
      virtualPet = JSON.stringify(makeNewVirtualPet("Keith", "The Computer"));
    }
    return JSON.parse(virtualPet) as VirtualPet;
  });

  const virtualPetComponentContext: VirtualPetComponentContext = {
    ...context, 
    getVirtualPet: () => virtualPet,
    setVirtualPet: (virtualPet: VirtualPet) => {
      context.kvStore.put(redisKeyVirtualPetState, JSON.stringify(virtualPet));
      setVirtualPet(virtualPet);
    },
    getViewState: () => viewState,
    setViewState: (action: ViewAction) => {
      const reducedState = reduce(viewState, action);
      setViewState(reducedState);
    }
  };

  switch (viewState.name) {
    case ViewStateName.VirtualPet:
      return virtualPetView(virtualPetComponentContext);
    default:
      return (<text>unable to find the view {viewState.name}</text>);
  }
}

export default VirtualPetRoot;
