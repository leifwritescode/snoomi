import { CustomPostType } from "@devvit/public-api";
import VirtualPet from "../../components/VirtualPet.js";

const VirtualPetCustomPost: CustomPostType = {
  name: 'VirtualPet',
  render: VirtualPet
};

export default VirtualPetCustomPost;
