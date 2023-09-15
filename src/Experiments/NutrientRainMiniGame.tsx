import { Context, Devvit, UseIntervalResult, UseStateResult } from "@devvit/public-api";
import { clamp } from "../math.js";
import CustomPostComponent = Devvit.CustomPostComponent;

/**
 * nutrient rain is a simple game where the player must move their character left and right to catch falling foods on their plate
 * there are thre columns and the items spawn at the top before falling at a fixed rate
 * once the nutrient reaches the bottom, if the player is in that column then they catch the food
 */

const framesPerSecond = 4;
const frameInterval = 1000 / framesPerSecond;

enum Direction {
  Left,
  Right
}

class NutrientRainMiniGame {
  private readonly _player: UseStateResult<number>;
  private readonly _interval: UseIntervalResult;
  private readonly _running: UseStateResult<boolean>;

  constructor({ useState, useInterval }: Context) {
    this._player = useState(1);
    this._running = useState(false);
    this._interval = useInterval(() => this.update(), frameInterval); // 4 fps? simulate old-timey screens
    this.resume();
  }

  private get player() : number {
    return this._player[0];
  }

  private set player(num: number) {
    this._player[0] = num;
    this._player[1](num);
  }

  get board(): JSX.Element {
    return (
      <text>todo</text>
    );
  }

  move(direction: Direction) {
    if (!this._running[0]) {
      return;
    }

    switch (direction) {
      case Direction.Left:
        this.player = clamp(this.player - 1, 0, 2);
        break;
      case Direction.Right:
        this.player = clamp(this.player + 1, 0, 2);
        break;
    }
  }

  update() {
    if (!this._running[0]) {
      return;
    }
  
    /**
     * each frame
     * - for each column
     *  - if the column is empty, spawn a random nutrient
     *  - else
     *   - the nutrient falls by one row
     *    - if the nutrient is in the final row
     *     - and the player is there, too, it is collected
     *    - if the nutrient "falls off", it is removed
     */
  }

  pause() {
    this._interval.stop();
    this._running[0] = false;
    this._running[1](false);
  }

  resume() {
    this._interval.start();
    this._running[0] = true;
    this._running[1](true);
  }
}

const NutrientRainComponent: CustomPostComponent = (context) => {
  const game = new NutrientRainMiniGame(context);

  return (
    <blocks height="tall">
      {game.board}
    </blocks>
  );
}