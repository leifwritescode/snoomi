import { Devvit } from "@devvit/public-api"
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";

const VirtualPetView: VirtualPetComponent = ({reddit, useState, getVirtualPet, setVirtualPet, setViewState}) => {
  const [currentUsername] = useState(async () => {
    const user = await reddit.getCurrentUser();
    return user.username;
  });

  const virtualPet = getVirtualPet();

  // hide the control deck if this pet belongs to a different user (but show it if its the default)
  const controlDeck = virtualPet.owner === currentUsername || virtualPet.owner === "The Computer" ? (
    <hstack backgroundColor="white" padding="medium">
      <button grow onPress={() => setViewState({ name: ViewActionName.GoToMealSelect })}>Feed</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, happiness: virtualPet.state.happiness + 10 }})}>Play</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, discipline: virtualPet.state.discipline + 10 }})}>Discipline</button>
      <spacer size="large"></spacer>
      <button grow>Toilet</button>
    </hstack>
  ) : (<></>);

  return (
    <vstack grow gap="medium" backgroundColor="white">
      <hstack backgroundColor="white" padding="medium">
        <zstack grow>
          <hstack alignment="start" backgroundColor="grey" cornerRadius="large">
            <vstack width={virtualPet.state.hunger} backgroundColor="red" cornerRadius="large">
              <spacer size="large"></spacer>
            </vstack>
          </hstack>
          <hstack padding="small">
            <text grow size={"large"} color="black" outline="none">🍔 {virtualPet.state.hunger}%</text>
          </hstack>
        </zstack>
        <spacer size="large"></spacer>
        <zstack grow>
          <hstack alignment="start" backgroundColor="grey" cornerRadius="large">
            <vstack width={virtualPet.state.happiness} backgroundColor="green" cornerRadius="large">
              <spacer size="large"></spacer>
            </vstack>
          </hstack>
          <hstack padding="small">
            <text grow size={"large"} color="black" outline="none">❤️ {virtualPet.state.happiness}%</text>
          </hstack>
        </zstack>
        <spacer size="large"></spacer>
        <zstack grow>
          <hstack alignment="start" backgroundColor="grey" cornerRadius="large">
            <vstack width={virtualPet.state.discipline} backgroundColor="blue" cornerRadius="large">
              <spacer size="large"></spacer>
            </vstack>
          </hstack>
          <hstack padding="small">
            <text grow size={"large"} color="black" outline="none">👮 {virtualPet.state.discipline}%</text>
          </hstack>
        </zstack>
      </hstack>
      <hstack grow>
      <spacer grow />
      <image url="https://i.imgur.com/EDhRCgI.gif" imageHeight={150} imageWidth={150} resizeMode="fit" />
      <spacer grow />
      </hstack>
     { controlDeck }
    </vstack>
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
