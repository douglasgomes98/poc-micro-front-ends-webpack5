export type ButtonProps = {
  onClick: () => void;
  text: string;
};

export function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.text}</button>;
}
