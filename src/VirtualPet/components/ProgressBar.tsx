import { Devvit } from "@devvit/public-api";

interface ProgressBarProps {
  progress: number,
  icon?: string,
  text?: string,
  bgcolor?: string,
  fgcolor?: string,
}

const ProgressBar = (props: ProgressBarProps) : JSX.Element => {
  return (
    <hstack grow gap="small">
      <text size="large" color="black" outline="none">{props.icon}</text>
      <zstack grow cornerRadius="full">
        <hstack
          border="thick"
          alignment="start"
          cornerRadius="full"
          borderColor={props.fgcolor ?? "orangered"}
          backgroundColor={props.bgcolor ?? "white"} />
        <hstack
          cornerRadius="full"
          width={props.progress}
          backgroundColor={props.fgcolor ?? "orangered"}/>
      </zstack>
      <text size="large" color="black" outline="none">{props.text}</text>
    </hstack>
  );
}

export default ProgressBar;
