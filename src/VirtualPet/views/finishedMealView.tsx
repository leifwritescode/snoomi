import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import ProgressBar from "../components/ProgressBar.js";
import { ViewActionName, ViewStateName } from "../types/ViewState.js";

const exclamations = [
  "Wow, this dish is simply divine!"
  ,"Mmm, I can't get enough of this mouthwatering goodness!"
  ,"Oh, my taste buds are in heaven!"
  ,"Incredible! This is the best thing I've ever tasted!"
  ,"Delicious doesn't even begin to describe this!"
  ,"Oh, wow! I'm in love with the flavors!"
  ,"Yum! This is pure culinary perfection!"
  ,"Oh, my goodness! This is a flavor explosion!"
  ,"Bravo! The chef has truly outdone themselves!"
  ,"Astonishingly tasty! I want to savor every single bite!"
  ,"Oh, my taste buds are doing the happy dance!"
  ,"Unbelievably scrumptious! I'm in foodie heaven!"
  ,"This is so good, I might have to do a happy food dance!"
  ,"I'm blown away by how incredibly delicious this is!"
  ,"Oh, the flavors in this dish are out of this world!"
  ,"Mouthwateringly good! I can't stop indulging!"
  ,"Holy smokes, this is a culinary masterpiece!"
  ,"Yesss! My taste buds are throwing a party right now!"
  ,"This dish is a symphony of flavors – bravo!"
  , "Oh, wow! I'll dream about this meal tonight, for sure!"
];

const randomExclamation = () : string => {
  const index = Math.floor(Math.random() * exclamations.length);
  return exclamations[index];
}

const FinishedMealView: VirtualPetComponent = ({setViewState, getViewState, getVirtualPet, useState}) => {
  const virtualPet = getVirtualPet();
  const viewState = getViewState();

  const [exclamation] = useState(randomExclamation());

  if (viewState.name !== ViewStateName.FinishedMeal) {
    const error = new Error("finishedmealview requires viewstate reducer be in finishedmeal state");
    throw error;
  }

  return (
    <vstack grow alignment="middle center" gap="large">
      <text size="xxlarge" weight="bold">{virtualPet.name} enjoyed their {viewState.meal}!</text>
      <vstack width={30} gap="medium">
        <ProgressBar progress={80} icon="🍔" text="+20 Sate"/>
        <ProgressBar progress={30} icon="❤️" text="+10 Joy"/>
        <ProgressBar progress={50} icon="🎂" text="-10 Weight"/>
      </vstack>
      <text size="large" style="body">{exclamation}</text>
      <button appearance="primary" onPress={() => setViewState({ name: ViewActionName.GoToVirtualPet })}>Go to Pet</button>
    </vstack>

  );
};

export default FinishedMealView;
