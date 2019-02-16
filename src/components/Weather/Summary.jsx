import React from "react";

const Summary = props => {
  if (props.city === undefined) {
    return null;
  }
  return (
    <div className="summary-block">
      <div className="tdc-block">
        <p>
          {props.city.name}, {props.city.country}
        </p>
        <p>
          {props.weather.day}, {props.weather.time}
        </p>
        <p className="weather-description">
          {props.weather.weather_description}
        </p>
      </div>
      <div className="temp-details-block">
        <div className="temp-block">
          <img alt="Fog" src="/assets/images/fog.png" />
          <p>{props.weather.temp}&deg; C</p>
        </div>
        <div className="details-block">
          <p>Percipitation: {props.weather.percipitation}%</p>
          <p>Humidity: {props.weather.humidity}%</p>
          <p>Wind: {props.weather.wind} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
