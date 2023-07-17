import { CustomPostType } from "@devvit/public-api";
import virtualPetView from "./views/virtualPetView.js";
import { ViewState, ViewStateName } from "./types/ViewState.js";

const VirtualPetRoot: CustomPostType["render"] = (context) => {
  // the individual views may set the view state, but it needs to be managed at the top level of the render loop
  // so that we don't trample it
  const [viewState, setViewState] = context.useState<ViewState>({ name: ViewStateName.VirtualPet });

  switch (viewState.name) {
    case ViewStateName.VirtualPet:
      return virtualPetView(context);
    default:
      throw new Error(`View state ${viewState.name} is not implemented`);
  }
}

export default VirtualPetRoot;
  