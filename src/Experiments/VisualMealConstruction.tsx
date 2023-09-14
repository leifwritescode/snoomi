import { Devvit } from "@devvit/public-api";
import { FoodGroup } from "../Nutrition/FoodGroups.js";
import { Plate } from "../Nutrition/Plate.js";

const FoodGroupColor = {
  [FoodGroup.Meat]: 'firebrick',
  [FoodGroup.Vegetables]: 'forestgreen',
  [FoodGroup.Fruits]: 'red',
  [FoodGroup.Mushrooms]: 'gainsboro',
  [FoodGroup.Fish]: 'salmon',
  [FoodGroup.Insects]: 'black',
};

function constructPlate(elements: FoodGroup[]): Plate {
  var plate: Plate = { meat: 0, vegetables: 0, fruits: 0, mushrooms: 0, fish: 0, insects: 0 };

  for (const element of elements) {
    switch  (element) {
      case FoodGroup.Meat:
        plate.meat++;
        break;
      case FoodGroup.Vegetables:
        plate.vegetables++;
        break;
      case FoodGroup.Fruits:
        plate.fruits++;
        break;
      case FoodGroup.Mushrooms:
        plate.mushrooms++;
        break;
      case FoodGroup.Fish:
        plate.fish++;
        break;
      case FoodGroup.Insects:
        plate.insects++;
        break;
    }
  }

  return plate;
}

export const VisualMealConstructionView:Devvit.CustomPostComponent = ({ useState, ui }) => {
  const [plate, setPlate] = useState<FoodGroup[]>([]);

  return (
    <blocks height="tall">
      <vstack padding="small" gap="medium" >
        <vstack gap="small" alignment="middle center">
          <text>Visual Meal Construction Experiment</text>
          <text>Select elements from the left, and see the meal constructed on the right!</text>
          <text>You can select up to six elements per meal. Adding more than this will remove elements first in, first out.</text>
        </vstack>
        <hstack gap="large" padding="small">
          <vstack grow gap="small">
            <button onPress={() => setPlate([FoodGroup.Meat, ...plate].slice(0, 6))}>Meat</button>
            <button onPress={() => setPlate([FoodGroup.Fish, ...plate].slice(0, 6))}>Fish</button>
            <button onPress={() => setPlate([FoodGroup.Vegetables, ...plate].slice(0, 6))}>Vegetables</button>
            <button onPress={() => setPlate([FoodGroup.Fruits, ...plate].slice(0, 6))}>Fruits</button>
            <button onPress={() => setPlate([FoodGroup.Mushrooms, ...plate].slice(0, 6))}>Mushrooms</button>
            <button onPress={() => setPlate([FoodGroup.Insects, ...plate].slice(0, 6))}>Insects</button>
          </vstack>
          <vstack grow>
            <text>Plate</text>
            { plate.map((e, _) => <hstack backgroundColor={FoodGroupColor[e]} cornerRadius="full" grow>{e}</hstack>) }
          </vstack>
        </hstack>
        <vstack alignment="middle center" gap="small">
          <text>Plate is {plate.length} element(s) long.</text>
          <hstack gap="medium">
            <button onPress={() => setPlate([])}>Clear Plate</button>
            <button onPress={() => ui.showToast('I would now reduce the simulation, and transition to a new view. Exciting!')}>Chow Down!</button>
          </hstack>
        </vstack>
      </vstack>
    </blocks>
  );
};
