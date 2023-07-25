import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";
import { Meal } from "../enums/Meal.js";

const MealSelectView: VirtualPetComponent = ({useState, setViewState}) => {
  const [selectedMeal, setSelectedMeal] = useState(Meal.None);

  return (
    <vstack gap="medium" backgroundColor="pink" grow>
      <hstack grow alignment="middle center" gap="medium" padding="large">
      <vstack gap="medium" grow alignment="middle">
        <hstack gap="medium" grow>
          <vstack grow>
            <text size="xxlarge" alignment="middle center">🍔</text>
            <button onPress={() => setSelectedMeal(Meal.Hamburger)}>{Meal.Hamburger}</button>
          </vstack>
          <vstack grow>
            <text size="xxlarge" alignment="middle center">🥗</text>
            <button onPress={() => setSelectedMeal(Meal.Salad)}>{Meal.Salad}</button>
          </vstack>
        </hstack>
        <hstack grow gap="medium">
          <vstack grow>
            <text size="xxlarge" alignment="middle center">🍎</text>
            <button onPress={() => setSelectedMeal(Meal.Fruit)}>{Meal.Fruit}</button>
          </vstack>
          <vstack grow>
            <text size="xxlarge" alignment="middle center">🍬</text>
            <button onPress={() => setSelectedMeal(Meal.Candy)}>{Meal.Candy}</button>
          </vstack>
        </hstack>
      </vstack></hstack>
      <hstack padding="large" backgroundColor="white">
        <button onPress={() => setViewState({ name: ViewActionName.GoToVirtualPet })}>Go back</button>
        <button
          onPress={() => setViewState({ name: ViewActionName.GoToFinishedMeal, meal: selectedMeal })} 
          grow
          disabled={ selectedMeal === Meal.None }>Eat {selectedMeal}
        </button>
      </hstack>
    </vstack>
  );
};

export default MealSelectView;
