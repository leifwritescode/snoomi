import { Context, Devvit } from "@devvit/public-api";

export enum Keys {
  Up = 1,
  Down,
  Left,
  Right,
  A,
  B,
};

export interface SubViewProps {
  context: Context;
  lastKey: Keys|undefined;
}

export const SubView = (props: SubViewProps) : JSX.Element => {
  console.log(`${Date.now()} redrawing SubView`);
  return (
    <vstack border="thick" borderColor="red" padding="small" gap="small">
      <text>Sub View</text>
      <text>Last Key: {props.lastKey || "nothing pressed"}</text>
    </vstack>
  );
};

export const BaseView = (context: Context) : JSX.Element => {
  console.log(`${Date.now()} redrawing BaseView`);
  const [keys, setKeys] = context.useState<Keys|undefined>(undefined);

  function enqueueKey(key: Keys) {
    console.log(`${Date.now()} enqueueing key ${key}`);
    setKeys(key);
  };

  return (
    <blocks height="tall">
      <vstack border="thick" borderColor="orange" padding="small" gap="small">
        <text>Base View</text>
        <SubView context={context} lastKey={keys} />
        <button onPress={() => enqueueKey(Keys.Up)}>Up</button>
        <button onPress={() => enqueueKey(Keys.Down)}>Down</button>
        <button onPress={() => enqueueKey(Keys.Left)}>Left</button>
        <button onPress={() => enqueueKey(Keys.Right)}>Right</button>
        <button onPress={() => enqueueKey(Keys.A)}>A</button>
        <button onPress={() => enqueueKey(Keys.B)}>B</button>
      </vstack>
    </blocks>
  );
}