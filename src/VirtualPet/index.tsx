import { CustomPostType } from "@devvit/public-api";
import { ViewActionName, initialViewState, reduce } from "./types/ViewState.js";
import { VirtualPetComponentContext } from "./types/VirtualPetComponent.js";
import { REDIS_KEY_KEITH } from "./constants.js";
import { VirtualPet } from "./VirtualPet.js";

const VirtualPetRoot: CustomPostType["render"] = (context) => {
  const redisKeyVirtualPetState = context.postId ?? REDIS_KEY_KEITH;
  const [viewState, setViewState] = context.useState(initialViewState);
  const [virtualPet, setVirtualPet] = context.useState(async () => {
    const virtualPet = await context.kvStore.get<string>(redisKeyVirtualPetState);
    if (virtualPet === undefined) {
      throw new Error(`Could not find VirtualPet with id ${redisKeyVirtualPetState}`);
    }
    return JSON.parse(virtualPet) as VirtualPet;
  });

  const virtualPetComponentContext: VirtualPetComponentContext = {
    ...context, 
    getVirtualPet: () => virtualPet,
    setVirtualPet: (virtualPet: VirtualPet) => {
      context.kvStore.put(context.postId!, JSON.stringify(virtualPet));
      setVirtualPet(virtualPet);
    },
    getViewState: () => viewState,
    setViewState: (action: ViewActionName) => {
      const reducedState = reduce(viewState, {
        name: action
      });
      setViewState(reducedState);
    }
  };

  return viewState.component(virtualPetComponentContext);
}

export default VirtualPetRoot;
