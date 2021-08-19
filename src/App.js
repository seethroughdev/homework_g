import React from "react";
import { Container } from "react-bootstrap";
import * as utils from "./utils";
import "./App.css";

function App() {
  const [dogFetchOffset, setDogFetchOffset] = React.useState(0);
  const { dogs, dogsFetchStatus } = utils.useDogsList(dogFetchOffset);
  const observerRef = React.useRef();

  const lastDogRef = React.useCallback(
    (ref) => {
      if (!ref || dogsFetchStatus === "LOADING") return;

      // disconnect observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries.length < 1) return;
        setDogFetchOffset((offset) =>
          entries[0].isIntersecting ? offset + 1 : offset
        );
      });

      observerRef.current.observe(ref);
    },
    [dogsFetchStatus]
  );

  return (
    <Container className="p-3">
      <div className="bg-dark p-5 rounded-3 mb-5">
        <h1 className="display-1 text-white">Infinite Dogs!</h1>
      </div>
      <h3>{dogsFetchStatus}</h3>
      <ul>
        {dogs.map((d, i) => {
          const isLast = i === dogs.length - 1;
          return (
            <li key={d} ref={isLast ? lastDogRef : undefined}>
              <img src={d} alt="dog" />
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

export default App;
