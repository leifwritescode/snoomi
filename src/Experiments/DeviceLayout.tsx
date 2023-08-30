import { Devvit } from "@devvit/public-api";

interface DeviceControlsProps {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onX: () => void;
  onY: () => void;
}

const DeviceControls = (props: DeviceControlsProps) : JSX.Element => {
  return (
    <hstack gap="medium">
      <hstack alignment="middle center">
        <button icon="left" onPress={() => props.onLeft()}/>
        <vstack gap="small">
          <button icon="up" onPress={() => props.onUp()}/>
          <button icon="down" onPress={() => props.onDown()}/>
        </vstack>
        <button icon="right" onPress={() => props.onRight()}/>
      </hstack>
      <vstack gap="small">
        <hstack>
          <spacer size="medium"/>
          <button onPress={() => props.onY()}>Y</button>
        </hstack>
        <hstack>
          <button onPress={() => props.onX()}>X</button>
        </hstack>
      </vstack>
    </hstack>
  );
};

const onUp = () => { console.log("up") };
const onDown = () => { console.log("down") };
const onLeft = () => { console.log("left") };
const onRight = () => { console.log("right") };
const onX = () => { console.log("x") };
const onY = () => { console.log("y") };

export const DeviceLayout:Devvit.CustomPostComponent = ({ }) => {
  return (
    <blocks height="tall">
      <zstack>
        <image url="DEVICE_1.png" imageWidth={580} imageHeight={512} />
        <vstack alignment="middle center" gap="small">
          <spacer size="large" />
          <hstack alignment="middle center" width={30} height={25} border="thin" borderColor="black" cornerRadius="small" backgroundColor="honeydew">
            <image url="EGG_CYAN.png" imageWidth={64} imageHeight={64} />
          </hstack>
          <DeviceControls
            onDown={onDown}
            onUp={onUp}
            onLeft={onLeft}
            onRight={onRight}
            onX={onX}
            onY={onY}
          />
        </vstack>
      </zstack>
    </blocks>
  )
};
