import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import { ViewActionName } from "../types/ViewState.js";
import { Meal } from "../enums/Meal.js";

/*

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
      </vstack>
      <hstack padding="large" backgroundColor="white">
        <button onPress={() => setViewState({ name: ViewActionName.GoToVirtualPet })}>Go back</button>
        <button
          onPress={() => setViewState({ name: ViewActionName.GoToFinishedMeal, meal: selectedMeal })} 
          grow
          disabled={ selectedMeal === Meal.None }>Eat {selectedMeal}
        </button>
      </hstack>*/

const MealSelectView: VirtualPetComponent = ({useState, setViewState}) => {
  const [selectedMeal, setSelectedMeal] = useState(Meal.None);

  return (
      <vstack grow alignment="middle center" backgroundColor="Lavender" gap="medium" padding="large">
        <text size="xxlarge" alignment="center">What Will You Feed Your Pet?</text>
        <text alignment="center">The food that you select has an impact on the hunger, happiness, and weight of your pet. Overweight, undeweight, and unhappy pets could become sick.</text>
        <hstack gap="medium">
          <button onPress={() => setSelectedMeal(Meal.Hamburger)}>{Meal.Hamburger}</button>
          <button onPress={() => setSelectedMeal(Meal.Salad)}>{Meal.Salad}</button>
          <button onPress={() => setSelectedMeal(Meal.Candy)}>{Meal.Candy}</button>
          <button onPress={() => setSelectedMeal(Meal.Fruit)}>{Meal.Fruit}</button>
        </hstack>
        <hstack gap="medium">
          <button
            onPress={() => setViewState({ name: ViewActionName.GoToVirtualPet })}
            appearance="bordered">Go Back</button>
          <button
            disabled={selectedMeal === Meal.None}
            onPress={() => setViewState({ name: ViewActionName.GoToFinishedMeal, meal: selectedMeal })}
            appearance="primary">Feed {selectedMeal}</button>
        </hstack>
      </vstack>
  );
};

export default MealSelectView;
