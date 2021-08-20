import * as React from "react";
import { fetchBlobFromUrl } from "../utils";

const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";
const OPEN_VISION_API = "https://api.openvisionapi.com/api/v1/detection";

/**
 * The setup actions for displaying the images includes several operations:
 *
 * - fetch image url (async)
 * - convert image to binary (async)
 * - send blob to open vision to get predictions (async)
 * - save data to dogs list so we can render in a separate component
 *
 */

/**
 * This custom React hook manaages fetching random dogs when offset changes,
 * as well as managing the fetchStatus of the app.
 * Normally, we would make this an enum of IDLE | ERROR | LOADING
 */
export const useDogsList = (dogFetchOffset) => {
  const [dogs, setDogs] = React.useState([]);
  const [dogsFetchStatus, setDogsFetchStatus] = React.useState("IDLE");

  /**
   * This async function sends a post to the open vision api to get a list of predictions
   */
  const detectObject = async (blob) => {
    const formData = new FormData();
    formData.append("model", "yolov4");
    formData.append("image", blob);

    try {
      const resp = await fetch(OPEN_VISION_API, {
        method: "post",
        body: formData,
      });

      const json = await resp.json();
      return json.predictions;
    } catch {
      setDogsFetchStatus("ERROR");
    }
  };

  React.useEffect(() => {
    // wrapping in try catch to preserve current dogs, but update fetchStatus
    const fetchRandomDog = async function () {
      setDogsFetchStatus("LOADING");

      try {
        const resp = await fetch(DOG_API_URL, {});
        const json = await resp.json();
        const blob = await fetchBlobFromUrl(json.message);
        const predictions = await detectObject(blob);

        const dogData = {
          url: json.message,
          src: URL.createObjectURL(blob),
          predictions,
        };

        setDogs((d) => [...d, dogData]);
        setDogsFetchStatus("IDLE");
      } catch {
        setDogsFetchStatus("ERROR");
      }
    };

    fetchRandomDog();
  }, [dogFetchOffset]);

  return { dogs, dogsFetchStatus };
};
