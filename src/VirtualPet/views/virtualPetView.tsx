import { Devvit } from "@devvit/public-api"
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";

const virtualPetView: VirtualPetComponent = ({reddit, useState, getVirtualPet, setVirtualPet}) => {
  const [currentUsername] = useState(async () => {
    const currentUser = await reddit.getCurrentUser();
    return currentUser.username;
  });
   
  const virtualPet = getVirtualPet();

  // we don't want to show the control deck if currentUser != state.owner
  const controlDeck = virtualPet.owner === currentUsername ? (
    <hstack backgroundColor="white" padding="medium">
      <button grow onPress={() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, hunger: virtualPet.state.hunger + 10 }})}>Feed</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, happiness: virtualPet.state.happiness + 10 }})}>Play</button>
      <spacer size="large"></spacer>
      <button grow onPress={() => setVirtualPet({ ...virtualPet, state: { ...virtualPet.state, discipline: virtualPet.state.discipline + 10 }})}>Discipline</button>
      <spacer size="large"></spacer>
      <button grow>Toilet</button>
    </hstack>
  ) : (<></>);

  return (
    <vstack gap="medium" backgroundColor="pink" cornerRadius="medium">
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
      <text style="heading" size="xxlarge">
        {virtualPet.owner}'s Snoomagotchi, {virtualPet.name}!
      </text>
     { controlDeck }
    </vstack>
  );
};

export default virtualPetView;
