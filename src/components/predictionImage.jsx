import * as React from "react";
import { getDimensionsFromBoundingBox } from "../utils";

export const PredictionImage = ({ data }) => {
  const imageRef = React.useRef();

  /**
   * To preserve the svg aspect ratio and size, we need to know the dimensions of the image.
   * Since we're loading the image from a blob, we don't know until
   * the image is loaded. Here we use the onLoad event to set the dimensions
   * of the svg after the component has rendered the image.
   */
  const [imageWidth, setImageWidth] = React.useState(0);
  const [imageHeight, setImageHeight] = React.useState(0);

  function handleDimensions() {
    if (imageRef.current) {
      setImageWidth(imageRef.current.clientWidth);
      setImageHeight(imageRef.current.clientHeight);
    }
  }

  // guessing alt tag by combining predictions
  const alt = data.predictions.map((p) => p.label).join(", ");

  return (
    <div className="image-container">
      <svg
        className="predictions-container"
        viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {data.predictions.map((prediction, i) => {
          const { x, y, w, h } = getDimensionsFromBoundingBox(prediction.bbox);
          return (
            <g key={`data.url-${i}`} transform={`translate(${x},${y})`}>
              <rect
                x={0}
                y={0}
                width={w}
                height={h}
                fillOpacity={0.0}
                stroke={"#00ff00"}
                className="prediction-border"
              />
            </g>
          );
        })}
      </svg>

      {/* we have to iterate through the predictions twice here for now.  This is a
      more efficient way to create labels that wrap outside the bounding box of svg,
      without requiring the need to create refs for every label and measure the text
      rendering.  We could also use a <foreignObject /> in svg.
       */}
      {data.predictions.map((prediction, i) => {
        const { x, y, w, h } = getDimensionsFromBoundingBox(prediction.bbox);
        return (
          <span
            className="text-label"
            key={`label-${i}-${prediction.label}`}
            style={{
              top: y + h - 10,
              left: x + w / 2,
            }}
          >
            {prediction.label}
          </span>
        );
      })}

      <img onLoad={handleDimensions} src={data.src} alt={alt} ref={imageRef} />
    </div>
  );
};
