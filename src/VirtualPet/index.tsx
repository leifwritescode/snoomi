import { CustomPostType } from "@devvit/public-api-next";
import virtualPetView from "./views/virtualPetView.js";

const VirtualPetRoot: CustomPostType["render"] = (props) => {
    return virtualPetView(props);
}

export default VirtualPetRoot;
