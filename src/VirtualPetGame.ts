import { Context, UseStateResult } from "@devvit/public-api";
import { VirtualPet } from "./VirtualPet.js";
import { exception } from "./utilities.js";
import { ViewAction, ViewState, initialViewState, reduce } from "./types/ViewState.js";

class VirtualPetGame {
  private readonly _petId: string;
  private readonly _virtualPet: UseStateResult<VirtualPet>;
  private readonly _viewState: UseStateResult<ViewState>;
  private _onServer: boolean;

  constructor({ useState, kvStore, postId }: Context) {
    this._petId = postId ?? exception('postId is not set');

    this._virtualPet = useState<VirtualPet>(async () =>
      await kvStore.get<VirtualPet>(this._petId) ?? exception(`pet ${this._petId} does not exist`)
    );
    this._viewState = useState(initialViewState());

    // todo interval for refreshing pet information

    this._onServer = false;
  }

  get virtualPet() : VirtualPet {
    return this._virtualPet[0];
  }

  set virtualPet(value: VirtualPet) {
    this._virtualPet[0] = value;
    this._virtualPet[1](value);
  }

  get viewState() : ViewState {
    return this._viewState[0];
  }

  // functionally, this is equivalent to set viewState
  navigate(action: ViewAction) {
    const reducedViewState = reduce(this._viewState[0], action);
    this._viewState[0] = reducedViewState;
    this._viewState[1](reducedViewState);
  }

  get onServer() : boolean {
    return this._onServer;
  }
}

export default VirtualPetGame;
