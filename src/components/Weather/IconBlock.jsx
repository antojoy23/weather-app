import React from "react";

const IconBlock = props => {
  let classStr = "";
  let day = props.weather.day.substring(0, 3);
  if (props.isactive === "true") {
    classStr = " active";
  }
  return (
    <div
      onClick={() => props.onDayChange(props.weatherId)}
      className={"icon-block icon-block-" + props.weatherId + classStr}
    >
      <p>{day}</p>
      <img alt="Sunny" src="/assets/images/sunny.png" />
      <div className="min-max-temp">
        <p>
          {props.weather.max_temp}&deg; {props.weather.min_temp}&deg;
        </p>
      </div>
    </div>
  );
};

export default IconBlock;
