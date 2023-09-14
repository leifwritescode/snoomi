import { Devvit } from "@devvit/public-api";
import { ViewActionName } from "../../types/ViewState.js";
import { DefaultMeal } from "../../nutrition/Plate.js";
import { Page } from "../Page.js";

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

      // todo meal creation screen!

const MealSelectPage: Page = ({ game }, { useState }) => {
  const [selectedMeal, setSelectedMeal] = useState<DefaultMeal>(DefaultMeal.OnePotMeal);

  return (
      <vstack grow alignment="middle center" backgroundColor="Lavender" gap="medium" padding="large">
        <text size="xxlarge" alignment="center">What Will You Food Your Pet?</text>
        <text alignment="center">The food that you select has an impact on the hunger, happiness, and weight of your pet. Overweight, underweight, and unhappy pets could become sick.</text>
        <hstack gap="medium">
          <button onPress={() => setSelectedMeal(DefaultMeal.Hamburger)}>{DefaultMeal.Hamburger}</button>
          <button onPress={() => setSelectedMeal(DefaultMeal.Salad)}>{DefaultMeal.Salad}</button>
          <button onPress={() => setSelectedMeal(DefaultMeal.MushroomSoup)}>{DefaultMeal.MushroomSoup}</button>
          <button onPress={() => setSelectedMeal(DefaultMeal.OnePotMeal)}>{DefaultMeal.OnePotMeal}</button>
        </hstack>
        <hstack gap="medium">
          <button
            onPress={() => game.navigate({ name: ViewActionName.GoToVirtualPet })}
            appearance="bordered">Go Back</button>
          <button
            disabled={selectedMeal === DefaultMeal.OnePotMeal}
            onPress={() => game.navigate({ name: ViewActionName.GoToFinishedMeal, meal: selectedMeal })}
            appearance="primary">Food {selectedMeal}</button>
        </hstack>
      </vstack>
  );
};

export default MealSelectPage;
