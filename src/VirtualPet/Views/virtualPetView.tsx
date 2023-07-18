import { Devvit, CustomPostType } from "@devvit/public-api"
import { REDIS_KEY_KEITH } from "../constants.js";
import { VirtualPet } from "../VirtualPet.js";

const virtualPetView: CustomPostType["render"] = ({postId, reddit, kvStore, useState}) => {
  const [currentUsername] = useState(async () => {
    const currentUser = await reddit.getCurrentUser();
    return currentUser.username;
  });

  // context.postId points to the snoomagotchi state in redis
  // until custom posts hit prod, it will contain nothing useful
  const redisKeyState = postId ?? REDIS_KEY_KEITH;
  const [virtualPet] = useState(async () => {
    const vps = await kvStore.get<string>(redisKeyState);
    return JSON.parse(vps!) as VirtualPet;
  });

  // todo in the real world, state will be held in kv store and server authoritative
  // the client side render stuff would mean a user could change values locally?
  // i should investigate the best way to surface the snoomagotchi state object to the views that manipulate it
  const [hunger, setHunger] = useState(0);
  const [play, setPlay] = useState(0);
  const [discipline, setDiscipline] = useState(0);

  // we don't want to show the control deck if currentUser != state.owner
  const controlDeck = (
    <hstack backgroundColor="white" padding="medium">
      <button grow onPress={() => setHunger(hunger + 1)}>Feed</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => setPlay(play + 1)}>Play</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => setDiscipline(discipline + 1)}>Discipline</button>
      <spacer size="large"></spacer>
      <button grow>Toilet</button>
    </hstack>
  );

  return (
    <vstack gap="medium" backgroundColor="pink" cornerRadius="medium">
      <hstack backgroundColor="white" padding="medium">
        <zstack grow>
          <hstack alignment="start" backgroundColor="grey" cornerRadius="large">
            <vstack width={hunger} backgroundColor="red" cornerRadius="large">
              <spacer size="large"></spacer>
            </vstack>
          </hstack>
          <hstack padding="small">
            <text grow size={"large"} color="black" outline="none">🍔 {hunger}%</text>
          </hstack>
        </zstack>
        <spacer size="large"></spacer>
        <zstack grow>
          <hstack alignment="start" backgroundColor="grey" cornerRadius="large">
            <vstack width={play} backgroundColor="green" cornerRadius="large">
              <spacer size="large"></spacer>
            </vstack>
          </hstack>
          <hstack padding="small">
            <text grow size={"large"} color="black" outline="none">❤️ {play}%</text>
          </hstack>
        </zstack>
        <spacer size="large"></spacer>
        <zstack grow>
          <hstack alignment="start" backgroundColor="grey" cornerRadius="large">
            <vstack width={discipline} backgroundColor="blue" cornerRadius="large">
              <spacer size="large"></spacer>
            </vstack>
          </hstack>
          <hstack padding="small">
            <text grow size={"large"} color="black" outline="none">👮 {discipline}%</text>
          </hstack>
        </zstack>
      </hstack>
      <text style="heading" size="xxlarge">
        {virtualPet.owner}'s Snoomagotchi, {virtualPet.name}!
      </text>
      {controlDeck}
    </vstack>
  );
};

export default virtualPetView;
