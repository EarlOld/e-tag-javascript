import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { subscribeCountContentDelivery, count } from "./utils/contentDelivery";

function App() {
  const [value, setValue] = useState(count.value);

  useEffect(() => {
    const unsubscribe = subscribeCountContentDelivery();

    count.subscribe((value) => {
      setValue(value);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Count: {value}</h1>
    </>
  );
}

export default App;
