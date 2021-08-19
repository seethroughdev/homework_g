import React from "react";
import { Container } from "react-bootstrap";
import * as utils from "./utils";
import "./App.css";

function App() {
  const { dogs, dogsFetchStatus } = utils.useDogsList(false);

  console.log(dogs, dogsFetchStatus);

  return (
    <Container className="p-3">
      <div className="bg-dark p-5 rounded-3 mb-5">
        <h1 className="display-1 text-white">Infinite Dogs!</h1>
      </div>
      <h3>{dogsFetchStatus}</h3>
      <ul>
        {dogs.map((d) => {
          return (
            <li key={d}>
              <img src={d} alt="dog" />
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

export default App;
