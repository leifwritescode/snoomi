import { Devvit } from "@devvit/public-api";
import { Page } from "../Page.js";
import { ViewActionName } from "../../types/ViewState.js";
import ProgressBar from "../ProgressBar.js";

const HomePage: Page = ({ game }, { reddit, useState }) => {

  const [currentUsername] = useState(async () => {
    const user = await reddit.getCurrentUser();
    return user.username;
  });
 
  const virtualPet = game.virtualPet

  // hide the control deck if this pet belongs to a different user (but show it if its the default)
  // todo control deck should change as the Snoomi ages
  const controlDeck = virtualPet.owner === currentUsername || virtualPet.owner === "The Computer" ? (
    <hstack backgroundColor="white" padding="medium" gap="large">
      <button grow onPress={() => game.navigate({ name: ViewActionName.GoToMealSelect })} disabled={game.onServer}>Food</button>
      <button grow onPress={() => game.navigate({ name: ViewActionName.GoToActivitySelect })} disabled={game.onServer}>Play</button>
      <button grow onPress={() => game.navigate({ name: ViewActionName.GoToActivitySelect })} disabled={game.onServer}>Discipline</button>
      <button grow disabled={game.onServer}>Toilet</button>
    </hstack>
  ) : (<></>);

  return (
    <zstack grow>
      <image url="https://i.imgur.com/ViJoRwZ.jpg" imageHeight={1} imageWidth={1} resizeMode="fill" width={100} height={100} />
      <vstack grow gap="medium">
        <hstack backgroundColor="white" padding="medium" gap="large">
          <ProgressBar progress={virtualPet.state.hunger} icon="🍔" text={`${virtualPet.state.hunger}%`} />
          <ProgressBar progress={virtualPet.state.happiness} icon="❤️" text={`${virtualPet.state.happiness}%`} />
          <ProgressBar progress={virtualPet.state.discipline} icon="👮" text={`${virtualPet.state.discipline}%`} />
        </hstack>
        <zstack grow alignment="middle center">
          <image url="https://i.imgur.com/EDhRCgI.gif" imageHeight={150} imageWidth={150} resizeMode="fit" />
        </zstack>
        { controlDeck }
      </vstack>
    </zstack>
  );

  /*      <animation
        url="lottie.host/765e969b-ef33-4f53-8772-85864794902f/C7YUxaSbXr.json"
        type="lottie"
        imageHeight={510}
        imageWidth={500}
        loop
        loopMode="repeat"
        speed={1}
        direction="forward"
        autoplay />*/
};

export default HomePage;
