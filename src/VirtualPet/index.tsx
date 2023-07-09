import { CustomPostType } from "@devvit/public-api";
import virtualPetView from "./views/virtualPetView.js";

const VirtualPetRoot: CustomPostType["render"] = (context) => {
    return virtualPetView(context);
}

export default VirtualPetRoot;
