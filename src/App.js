import React from "react";
import { Container } from "react-bootstrap";
import { useDogsList } from "./hooks/useDogsList";
import { PredictionImage } from "./components/predictionImage";
import "./App.css";

function App() {
  // We use the "fetchOffset" to signify changes to the React, useEffect.  This allows us to have full control
  // when we want the useDogsList to attempt a new fetch.
  const [dogFetchOffset, setDogFetchOffset] = React.useState(0);

  // All state of the dogs are returned here, we wrap the fetch in a custom hook to support other data like fetchStatus.
  const { dogs, dogsFetchStatus } = useDogsList(dogFetchOffset);

  // We are using the Intersection Observer API to watch for visible dom elements on the screen,
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  // there are other options we can use, but this one is natively supported and more efficient than watching for
  // scroll events. It can also be polyfilled easily if necessary.
  const observerRef = React.useRef();

  // Wrapping a ref in a useCallback is a way to apply changes to the actual react dom implementation.
  // https://medium.com/welldone-software/usecallback-might-be-what-you-meant-by-useref-useeffect-773bc0278ae
  // here we watch for fetchStatus changes, and update the observer.  It also allows us to manually force the
  // dogs fetch by changing the offset.
  const lastDogRef = React.useCallback(
    (ref) => {
      if (!ref || dogsFetchStatus === "LOADING") return;

      // disconnect observer if it exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries.length < 1) return;
          setDogFetchOffset((offset) =>
            entries[0].isIntersecting ? offset + 1 : offset
          );
        },
        { rootMargin: "0px 0px 1500px 0px" }
      );

      observerRef.current.observe(ref);
    },
    [dogsFetchStatus]
  );

  return (
    <Container className="p-3">
      <div className="bg-dark p-5 rounded-3 mb-5">
        <h1 className="display-1 text-white">Infinite Dogs!</h1>
      </div>
      <ul className="dogs-list">
        {dogs.map((dog, i) => (
          <li
            key={dog.url}
            ref={i === dogs.length - 1 ? lastDogRef : undefined}
          >
            <PredictionImage data={dog} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default App;
