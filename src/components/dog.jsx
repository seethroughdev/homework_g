import * as React from "react";

export const Dog = ({ data }) => {
  //   console.log(data.src);
  //   const imageRef = React.useRef();
  //   if (imageRef.current) {
  //     console.log(imageRef.current.width);
  //   }

  return (
    <div>
      <svg>
        <g>
          {data.predictions.map((prediction, i) => {
            console.log(prediction);
            return (
              <rect
                key={`data.url-${i}`}
                x={prediction.bbox.y1}
                y={prediction.bbox.x1}
                width={prediction.bbox.x2 - prediction.bbox.x1}
                height={prediction.bbox.y2 - prediction.bbox.y1}
                fill="#ff0000"
                opacity="0.2"
              />
            );
          })}
        </g>
      </svg>

      <img src={data.src} alt="dog" />
    </div>
  );
};
