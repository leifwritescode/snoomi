import { Devvit, MenuItem } from "@devvit/public-api";
import { newSnoomiFormConfig } from "../forms/newSnoomiForm.js";

const CreateNewSnoomiMenuItem: MenuItem = {
  label: "DEVMODE: Create My Snoomi!",
  description: "Create a new Snoomi for the currently logged in user.",
  location: "subreddit",
  forUserType: ["moderator"],
  onPress: (_, context) => {
    // eep
    const formKeyNewSnoomi = Devvit.createForm(newSnoomiFormConfig.form, newSnoomiFormConfig.handler);
    context.ui.showForm(formKeyNewSnoomi);
  }
}

export default CreateNewSnoomiMenuItem;
