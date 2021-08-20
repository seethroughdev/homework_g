import React from "react";
import { Container, Spinner } from "react-bootstrap";
import { PredictionImage } from "./components/predictionImage";
import { useDogsList } from "./hooks/useDogsList";
import "./App.css";

function App() {
  // We're using a simple number increment to communicate a dirty state in the useDogsList hook.
  const [fetchOffset, setFetchOffset] = React.useState(0);

  // All state of the dogs are returned here and status of the fetch is returned here, each time the fetchOffset is changed,
  // the custom hook will run
  const { dogs, dogsFetchStatus } = useDogsList(fetchOffset);

  // We are using the Intersection Observer API to watch for visible dom elements on the screen,
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  // there are other options we can use, but this one is natively supported and more efficient than watching for
  // scroll events. It can also be polyfilled easily if necessary.
  const observerRef = React.useRef();

  // Wrapping a ref in a useCallback is a way to apply changes to the actual react dom implementation.
  // https://medium.com/welldone-software/usecallback-might-be-what-you-meant-by-useref-useeffect-773bc0278ae
  // here we watch for fetchStatus changes, and update the observer.  Then we can force the fetch by changing the offset.
  const lastImageRef = React.useCallback(
    (ref) => {
      if (!ref || dogsFetchStatus === "LOADING") return;

      // disconnect observer if it exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries.length < 1) return;
          setFetchOffset((offset) =>
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

      {/* on initial load, let user know its working */}
      {dogsFetchStatus === "LOADING" && dogs.length === 0 ? (
        <div className="loading-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : (
        <ul className="dogs-list">
          {dogs.map((dog, i) => (
            <li
              key={`${dog.url}-${i}`}
              ref={i === dogs.length - 1 ? lastImageRef : undefined}
            >
              <PredictionImage data={dog} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export default App;
