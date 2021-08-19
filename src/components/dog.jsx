import * as React from "react";

export const Dog = ({ data }) => {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const imageRef = React.useRef();

  function updateDimensions() {
    if (imageRef.current) {
      setWidth(imageRef.current.clientWidth);
      setHeight(imageRef.current.clientHeight);
    }
  }

  return (
    <div className="imageContainer">
      <svg
        className="predictionsContainer"
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {data.predictions.map((prediction, i) => {
          const rectWidth = prediction.bbox.x2 - prediction.bbox.x1;
          const rectHeight = prediction.bbox.y2 - prediction.bbox.y1;
          return (
            <g
              key={`data.url-${i}`}
              transform={`translate(${prediction.bbox.x1},${prediction.bbox.y1})`}
            >
              <rect
                x={0}
                y={0}
                width={rectWidth}
                height={rectHeight}
                fillOpacity={0.0}
                stroke={"#00ff00"}
                className="predictionBorder"
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
      {data.predictions.map((prediction) => {
        const rectWidth = prediction.bbox.x2 - prediction.bbox.x1;
        const rectHeight = prediction.bbox.y2 - prediction.bbox.y1;
        const x = prediction.bbox.x1;
        const y = prediction.bbox.y1;
        return (
          <span
            className="textLabel"
            style={{
              top: y + rectHeight - 10,
              left: x + rectWidth / 2,
            }}
          >
            {prediction.label}
          </span>
        );
      })}

      <img onLoad={updateDimensions} src={data.src} alt="dog" ref={imageRef} />
    </div>
  );
};
