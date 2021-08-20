import * as React from "react";
import { getDimensionsFromBoundingBox } from "../utils";

/**
 * This component will render an image along with predictions drawn on top.
 * I chose to use SVG instead of canvas to preserve event interactions, but
 * we could obviously do either.
 */
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

  // guessing alt tag by combining prediction labels
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

      {/* chose to use html to render the labels as there's never a simple and efficient
      way to render text labels with background in svg.  we could add refs and measure
      the width of text and append a rectangle behind after drawing, but it felt simpler
      to render with html.  we could have used a foreignObject in svg as well.
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
