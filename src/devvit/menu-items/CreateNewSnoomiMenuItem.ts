import { FormKey, MenuItem } from "@devvit/public-api";
const CreateNewSnoomiMenuItemFactory = (formKey: FormKey) : MenuItem => {
  return {
    label: "DEVMODE: Create My Snoomi!",
    description: "Create a new Snoomi for the currently logged in user.",
    location: "subreddit",
    forUserType: ["moderator"],
    onPress: (_, context) => {
      context.ui.showForm(formKey);
    }
  };
}

export default CreateNewSnoomiMenuItemFactory;
