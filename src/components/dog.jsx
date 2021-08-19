import * as React from "react";

export const Dog = ({ data }) => {
  //   console.log(data.src);
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
          console.log(prediction);
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
              {/* <foreignObject
                x={0}
                y={rectHeight - 10}
                width={rectWidth}
                height="22"
              >
                <span
                  xmlns="http://www.w3.org/1999/xhtml"
                  className="textLabel"
                >
                  {prediction.label}
                </span>
              </foreignObject> */}
              {/* <text text-anchor="middle">{prediction.label}</text> */}
            </g>
          );
        })}
      </svg>

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
