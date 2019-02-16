import React from "react";
import IconBlock from "./IconBlock";

const Footer = props => {
  let addedDays = [];
  let iconBlocks = props.data.weatherDetails.map(function(details) {
    if (addedDays.indexOf(details.day) === -1) {
      let detailsId = props.data.weatherDetails.indexOf(details);
      addedDays.push(details.day);
      if (addedDays.length === 1) {
        return (
          <IconBlock
            key={detailsId}
            weatherId={detailsId}
            onDayChange={props.onDayChange}
            weather={details}
            isactive="true"
          />
        );
      }
      return (
        <IconBlock
          key={detailsId}
          onDayChange={props.onDayChange}
          weatherId={detailsId}
          weather={details}
        />
      );
    }
    return null;
  });
  console.log(iconBlocks);
  return <div className="footer-weather-icon-block">{iconBlocks}</div>;
};

export default Footer;
