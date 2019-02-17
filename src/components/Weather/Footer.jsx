import React from "react";
import $ from "jquery";
import IconBlock from "./IconBlock";

const Footer = props => {
  let isActiveSet;
  let iconBlocks = [];
  $.each(props.data.weatherDetails, function(index, details) {
    let iconBlock;
    if (isActiveSet === undefined) {
      isActiveSet = true;
      iconBlock = (
        <IconBlock
          key={index}
          weatherId={index}
          onDayChange={props.onDayChange}
          weather={details[0]}
          isactive="true"
        />
      );
    } else {
      iconBlock = (
        <IconBlock
          key={index}
          onDayChange={props.onDayChange}
          weatherId={index}
          weather={details[0]}
        />
      );
    }
    iconBlocks.push(iconBlock);
  });
  return <div className="footer-weather-icon-block wsection">{iconBlocks}</div>;
};

export default Footer;
