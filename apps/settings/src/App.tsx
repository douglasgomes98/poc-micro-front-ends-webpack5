import { Button } from "./components/Button";

export function App() {
  const handleClick = () => {
    console.log("Button clicked from settings App!");
  };

  return (
    <div>
      <h1>Micro Frontend (Settings)</h1>
      <Button onClick={handleClick} text="Shared Button" />
    </div>
  );
}
