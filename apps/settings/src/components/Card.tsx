export interface CardProps {
  title: string;
}

export default function Card({ title }: CardProps) {
  return (
    <div
      style={{
        borderRadius: "4px",
        padding: "2em",
        backgroundColor: "purple",
        color: "white",
      }}
    >
      <h1>Card</h1>

      <p>{title}</p>
    </div>
  );
}
