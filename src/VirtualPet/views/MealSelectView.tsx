import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";

const MealSelectView: VirtualPetComponent = ({useState, setViewState}) => {
  const [selectedMeal, setSelectedMeal] = useState("");

  return (
    <vstack gap="medium" backgroundColor="pink" cornerRadius="medium">
      <vstack padding="medium">
      <hstack grow>
        <vstack grow>
          <text size="xxlarge" alignment="middle center">🍔</text>
          <button onPress={() => setSelectedMeal("Hamburger")}>Hamburger</button>
        </vstack>
        <spacer size="large" />
        <vstack grow>
          <text size="xxlarge" alignment="middle center">🥗</text>
          <button onPress={() => setSelectedMeal("Salad")}>Salad</button>
        </vstack>
      </hstack>
      <spacer size="large" />
      <hstack grow>
        <vstack grow>
          <text size="xxlarge" alignment="middle center">🍎</text>
          <button onPress={() => setSelectedMeal("Fruit")}>Fruit</button>
        </vstack>
        <spacer size="large" />
        <vstack grow>
          <text size="xxlarge" alignment="middle center">🍬</text>
          <button onPress={() => setSelectedMeal("Sweets")}>Sweets</button>
        </vstack>
      </hstack>
      </vstack>
      <hstack padding="large" backgroundColor="white">
        <button onPress={() => setViewState({ name: ViewActionName.GoToVirtualPet })}>Go back</button>
        <spacer size="large" />
        <button
          onPress={() => setViewState({ name: ViewActionName.GoToFinishedMeal, meal: selectedMeal })} 
          grow
          disabled={ selectedMeal === "" }>Eat {selectedMeal}
        </button>
      </hstack>
    </vstack>
  );
};

export default MealSelectView;
