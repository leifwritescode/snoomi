import { Devvit } from "@devvit/public-api"
import { VirtualPetComponent } from "./VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";
import ProgressBar from "./components/ProgressBar.js";


/*
      <spacer size="large"></spacer>
      <button grow onPress={() => onServer(() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, happiness: virtualPet.state.happiness + 10 }}))} disabled={getIsServerCall()}>Play</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => onServer(() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, discipline: virtualPet.state.discipline + 10 }}))} disabled={getIsServerCall()}>Discipline</button>*/

const VirtualPetView: VirtualPetComponent = ({reddit, useState, getVirtualPet, setViewState, getIsServerCall}) => {
  const [currentUsername] = useState(async () => {
    const user = await reddit.getCurrentUser();
    return user.username;
  });
 
  const virtualPet = getVirtualPet();

  // hide the control deck if this pet belongs to a different user (but show it if its the default)
  // todo control deck should change as the Snoomi ages
  const controlDeck = virtualPet.owner === currentUsername || virtualPet.owner === "The Computer" ? (
    <hstack backgroundColor="white" padding="medium" gap="large">
      <button grow onPress={() => setViewState({ name: ViewActionName.GoToMealSelect })} disabled={getIsServerCall()}>Food</button>
      <button grow onPress={() => setViewState({ name: ViewActionName.GoToActivitySelect })} disabled={getIsServerCall()}>Play</button>
      <button grow onPress={() => setViewState({ name: ViewActionName.GoToActivitySelect })} disabled={getIsServerCall()}>Discipline</button>
      <button grow disabled={getIsServerCall()}>Toilet</button>
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

export default VirtualPetView;
