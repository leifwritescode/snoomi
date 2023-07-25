import { Devvit } from "@devvit/public-api";
import { VirtualPetComponent } from "../types/VirtualPetComponent.js";



const FinishedMealView: VirtualPetComponent = (context) => {
  return (
    <vstack>
      <text>[pet name] fininished their [meal name]</text>

    </vstack>

  );
};

export default FinishedMealView;
