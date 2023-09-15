import { Context, KVStore, UseIntervalResult, UseStateResult } from "@devvit/public-api";
import { makeNewVirtualPet, VirtualPet } from "./VirtualPet.js";
import { exception } from "./utilities.js";
import { ViewAction, ViewState, initialViewState, navigate } from "./types/ViewState.js";
import { Influence } from "./simulation/Influences.js";
import { simulate } from "./simulation/index.js";
import { REDIS_KEY_KEITH } from "./constants.js";

class VirtualPetGame {
  private readonly _petId: string;
  private readonly _virtualPet: UseStateResult<VirtualPet>;
  private readonly _viewState: UseStateResult<ViewState>;
  private readonly _refreshPetInterval: UseIntervalResult;
  private readonly _redis: KVStore;

  constructor({ useState, useInterval, kvStore, postId }: Context) {
    this._petId = postId ?? REDIS_KEY_KEITH; // exception('postId is not set');
    this._redis = kvStore;

    this._viewState = useState(initialViewState());
    this._virtualPet = useState<VirtualPet>(async () => {
      // populate the kvstore if we're using keith
      if (this._petId === REDIS_KEY_KEITH) {
        const keys = await this._redis.list();
        if (!keys.some(v => v === REDIS_KEY_KEITH)) {
          const keith = makeNewVirtualPet("Keith", "The Computer");
          kvStore.put(REDIS_KEY_KEITH, keith);
        }
      }

      return VirtualPetGame.fetchPetFromServer(this._petId, this._redis);
    });

    this._refreshPetInterval = useInterval(async () => {
      this._virtualPet[0] = await VirtualPetGame.fetchPetFromServer(this._petId, this._redis);
      this._virtualPet[1](this._virtualPet[0]);
    }, 60000);
    this._refreshPetInterval.start();
  }

  get virtualPet() : VirtualPet {
    return this._virtualPet[0];
  }

  get viewState() : ViewState {
    return this._viewState[0];
  }

  get onServer() : boolean {
    return false;
  }

  simulate(influence: Influence) {
    const simulationResult = simulate(this._virtualPet[0].state, influence);
    this._virtualPet[0].state = simulationResult;
    this._virtualPet[1](this._virtualPet[0]);
    this._redis.put(this._petId, this._virtualPet[0]);
  }

  navigate(action: ViewAction) {
    const navigationResult = navigate(this._viewState[0], action);
    this._viewState[0] = navigationResult;
    this._viewState[1](navigationResult);
  }

  private static async fetchPetFromServer(petId: string, redis: KVStore) : Promise<VirtualPet> {
    return await redis.get<VirtualPet>(petId) ?? exception(`pet ${petId} does not exist`);
  }
}

export default VirtualPetGame;
