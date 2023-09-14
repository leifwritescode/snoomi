import { Devvit } from "@devvit/public-api";
import { ProgressBarProps } from "./ProgressBarProps.js";
import BlockComponent = Devvit.BlockComponent;

const ProgressBar: BlockComponent<ProgressBarProps> = ({ progress, icon, text, bgcolor, fgcolor }) => {
  return (
    <hstack grow gap="small">
      <text size="large" color="black" outline="none">{icon}</text>
      <zstack grow cornerRadius="full">
        <hstack
          border="thick"
          alignment="start"
          cornerRadius="full"
          borderColor={fgcolor ?? "orangered"}
          backgroundColor={bgcolor ?? "white"} />
        <hstack
          cornerRadius="full"
          width={progress === 0 ? 1 : progress}
          backgroundColor={fgcolor ?? "orangered"}/>
      </zstack>
      <text size="large" color="black" outline="none">{text}</text>
    </hstack>
  );
}

export default ProgressBar;
