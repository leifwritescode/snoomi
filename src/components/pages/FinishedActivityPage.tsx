import { Devvit } from "@devvit/public-api";
import { getRandomElementFromArray } from "../../utilities.js";
import { ViewActionName, ViewStateName } from "../../types/ViewState.js";
import ProgressBar from "../ProgressBar.js";
import { Page } from "../Page.js";

const exclamations = [
  "That was an absolute blast – so much fun!"
  ,"What an adrenaline-pumping adventure that was!"
  ,"I can't stop smiling from all the enjoyment!"
  ,"A day filled with laughter and joy – just perfect!"
  ,"I'm on cloud nine after that amazing experience!"
  ,"Pure exhilaration! I'll cherish these memories forever!"
  ,"My heart is still racing from all the excitement!"
  ,"Epic fun! I'll remember this forever!"
  ,"Unforgettable moments and a barrel of laughs – can't beat that!"
  ,"I'm pumped up and ready for round two!"
  ,"That was hands down the best time I've had in ages!"
  ,"My face hurts from smiling so much – that's how much fun I had!"
  ,"My heart is full, and my soul is happy – that's what I call fun!"
  ,"I'm floating on a cloud of happiness after that awesome activity!"
  ,"Kudos to everyone involved – that was a total blast!"
  ,"I'm already planning the next adventure – I can't get enough!"
  ,"Incredible memories were made today – I'll cherish them forever!"
  ,"What a rush! I feel alive and energized!"
  ,"That activity was a sheer joy ride – count me in for more!"
  ,"Time spent like this is the true essence of living!"
  ,"I'm still buzzing from all the excitement – that was amazing!"
  ,"What a fantastic adventure – my spirits are soaring!"
  ,"I'm grinning ear to ear – that activity was a total hit!"
  ,"What a thrill! I feel alive and invigorated!"
  ,"I'm filled with happiness and pure delight!"
  ,"That was an absolute joy – I couldn't have asked for more!"
  ,"My heart is singing with joy after that incredible experience!"
  ,"I feel like I could conquer the world after that exhilarating time!"
  ,"Cheers to fun-filled moments and unforgettable memories!"
  ,"I'm beyond grateful for the laughter and camaraderie!"
  ,"That was an adventure of a lifetime – count me in for more!"
  ,"I'm on cloud nine – that activity was the highlight of my day!"
  ,"My face hurts from smiling so much – what an absolute blast!"
  ,"I'm beaming with happiness – that's what great times do!"
  ,"Who knew that fun could be so invigorating?"
  ,"Incredible fun – this is what life is all about!"
  ,"The thrill of the moment has left me in awe!"
  ,"I'm riding high on the wave of joy after that activity!"
  ,"It's moments like these that make life truly worthwhile!"
  ,"Today was a reminder that happiness is found in simple pleasures!"
];

const FinishedActivityPage: Page = ({ game }, { useState }) => {
    const virtualPet = game.virtualPet;
    const viewState = game.viewState;

    const [exclamation] = useState(getRandomElementFromArray(exclamations));

    if (viewState.name !== ViewStateName.FinishedActivity) {
      const error = new Error("FinishedActivityView requires viewstate reducer be in FinishedActivity state");
      throw error;
    }

    return (
      <vstack grow alignment="middle center" gap="large" backgroundColor="LightYellow">
        <text size="xxlarge" weight="bold">{virtualPet.name} enjoyed their {viewState.activity}!</text>
        <vstack width={30} gap="medium">
          <ProgressBar progress={90} icon="❤️" text="+20 Joy"/>
          <ProgressBar progress={60} icon="👮" text="+10 Discipline"/>
        </vstack>
        <text size="large" style="body">{exclamation}</text>
        <button appearance="success" onPress={() => game.navigate({ name: ViewActionName.GoToVirtualPet })}>Go to Pet</button>
      </vstack>
    );
};

export default FinishedActivityPage;
