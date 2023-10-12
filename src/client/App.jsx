import { useState } from "react";
import reactLogo from "./assets/react.svg";
import CreateGroup from "./components/CreateGroup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Hello World</h1>
      <CreateGroup/> 
    </div>
  );
}

export default App;
