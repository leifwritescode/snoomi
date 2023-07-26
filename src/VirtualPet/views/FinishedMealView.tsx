import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";
import ProgressBar from "../components/ProgressBar.js";
import { ViewActionName, ViewStateName } from "../types/ViewState.js";
import { getRandomElementFromArray } from "../utilities.js";

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
  ,"This is foodgasmic! My taste buds are in ecstasy!"
  ,"Oh, my palate is singing with joy!"
  ,"Delightful, delectable, and divine – all in one bite!"
  ,"I'm in awe of how incredibly delicious this dish is!"
  ,"Mmm, it's like a party in my mouth!"
  ,"Flavor perfection achieved – this is food wizardry!"
  ,"My compliments to the chef – this is top-notch!"
  ,"Sensational! I can't get enough of this culinary wonder!"
  ,"Brace yourself for a flavor explosion – it's extraordinary!"
  ,"A taste so exquisite, it's like poetry in motion!"
  ,"Oh, yes! This dish is a true gastronomic treasure!"
  ,"I'm in food heaven, and I never want to leave!"
  ,"Pure bliss on a plate – I'm savoring every bite!"
  ,"My taste buds are doing a happy dance of appreciation!"
  ,"Calling all foodies, you must try this – it's epic!"
  ,"This is the kind of food that makes life worth living!"
  ,"Wow, my taste buds have hit the jackpot with this one!"
  ,"I'm officially obsessed – this flavor profile is incredible!"
  ,"I'm lost for words – this is beyond scrumptious!"
  ,"I bow to the culinary genius behind this masterpiece!"
];

const FinishedMealView: VirtualPetComponent = ({setViewState, getViewState, getVirtualPet, useState}) => {
  const virtualPet = getVirtualPet();
  const viewState = getViewState();

  const [exclamation] = useState(getRandomElementFromArray(exclamations));

  if (viewState.name !== ViewStateName.FinishedMeal) {
    const error = new Error("finishedmealview requires viewstate reducer be in finishedmeal state");
    throw error;
  }

  return (
    <vstack grow alignment="middle center" gap="large" backgroundColor="PowderBlue">
      <text size="xxlarge" weight="bold">{virtualPet.name} enjoyed their {viewState.meal}!</text>
      <vstack width={30} gap="medium">
        <ProgressBar progress={80} icon="🍔" text="+20 Sate"/>
        <ProgressBar progress={30} icon="❤️" text="+10 Joy"/>
        <ProgressBar progress={50} icon="🎂" text="-10 Weight"/>
      </vstack>
      <text size="large" style="body">{exclamation}</text>
      <button appearance="success" onPress={() => setViewState({ name: ViewActionName.GoToVirtualPet })}>Go to Pet</button>
    </vstack>
  );
};

export default FinishedMealView;
