import React, { Component } from "react";
import $ from "jquery";
import "./index.css";
import Summary from "./Summary";
import Graph from "./Graph";
import Footer from "./Footer";

const API = "https://api.openweathermap.org/";

class Weather extends Component {
  state = {};
  render() {
    if (this.state.api_key === undefined || this.state.api_key === "") {
      return (
        <div className="api-key-block">
          <h2>Weather Forecast</h2>
          <p>
            This app uses the{" "}
            <a
              href="https://openweathermap.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              OpenWeatherMap
            </a>{" "}
            API to show 5 day/ 3 hour weather forecast.
          </p>
          <input
            className="api-key-input"
            type="text"
            placeholder="Enter your API Key here"
          />
          <input type="submit" onClick={this.handleApiSubmit} />
        </div>
      );
    }
    if (this.state.city === undefined) {
      return (
        <div className="loader-block">
          <div className="loader" />
        </div>
      );
    }
    return (
      <div className="main-container">
        <Summary
          city={this.state.city}
          weather={this.state.currentWeather}
          currentDay={this.state.currentDay}
        />
        <Graph data={this.state} onGraphClick={this.handleGraphClick} />
        <Footer data={this.state} onDayChange={this.handleDayChange} />
      </div>
    );
  }

  componentDidMount() {
    this.state.api_key !== undefined && this.getGeoLocation();
  }

  handleGraphClick = element => {
    if (element.length > 0) {
      let index = element[0]._index;
      this.setState({
        currentWeather: this.state.weatherDetails[this.state.currentDay][index]
      });
    }
  };

  handleApiSubmit = () => {
    if ($(".api-key-input").val() !== "") {
      this.setState({
        api_key: escape($(".api-key-input").val())
      });
      this.getGeoLocation();
    }
  };

  handleDayChange = index => {
    let newCurrentWeather = this.state.weatherDetails[index][0];
    $(".icon-block").removeClass("active");
    $(".icon-block-" + index).addClass("active");
    this.setState({
      currentWeather: newCurrentWeather,
      currentDay: index
    });
  };

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getPosition,
        this.handleGeoError
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  getPosition = position => {
    this.getWeatherForecast(
      position.coords.latitude,
      position.coords.longitude
    );
  };

  handleGeoError = error => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      default:
        alert("An unknown error occurred.");
        break;
    }
  };

  getWeatherForecast = (lat, lon) => {
    let self = this;
    $.getJSON(
      `${API}data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
        this.state.api_key
      }`
    ).then(res => self.processResponse(res));
  };

  processResponse = response => {
    if (response.cod === "200") {
      let self = this;
      let city = { name: response.city.name, country: response.city.country };
      let weatherDetails = {};
      let currentDay;
      $.each(response.list, function(index, weather) {
        let day = self.getDay(weather.dt);
        if (currentDay === undefined) {
          currentDay = day;
        }
        if (!weatherDetails.hasOwnProperty(day)) {
          weatherDetails[day] = [];
        }
        let details = {
          time: self.getTime(weather.dt_txt),
          min_temp: Math.round(weather.main.temp_min - 273.15),
          max_temp: Math.round(weather.main.temp_max - 273.15),
          temp: Math.round(weather.main.temp - 273.15),
          humidity: weather.main.humidity,
          wind: Math.round(weather.wind.speed * 3.6),
          weather_icon: self.getIconName(weather.weather[0].icon),
          weather_description: weather.weather[0].description,
          percipitation: weather.clouds.all
        };
        weatherDetails[day].push(details);
      });
      this.setState({
        city,
        weatherDetails,
        currentWeather: weatherDetails[currentDay][0],
        currentDay: currentDay
      });
    }
  };

  getIconName = type => {
    let iconName = "";
    switch (type.substr(0, 2)) {
      case "01":
        iconName = "sunny";
        break;
      case "02":
        iconName = "partly-sunny";
        break;
      case "04":
        iconName = "cloud";
        break;
      case "09":
      case "10":
        iconName = "rain";
        break;
      case "11":
        iconName = "thunderstorm";
        break;
      case "13":
        iconName = "snow";
        break;
      case "50":
        iconName = "mist";
        break;
      default:
        iconName = "cloud";
        break;
    }
    if (type.slice(-1) === "n") {
      if (iconName === "sunny") {
        iconName = "night";
      }
      if (iconName === "partly-sunny") {
        iconName = "night-cloud";
      }
    }
    return iconName;
  };

  getDay = timestamp => {
    let offset = new Date().getTimezoneOffset();
    timestamp += offset * 60;
    let currentDate = new Date(timestamp * 1000);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    return days[currentDate.getDay()];
  };

  getTime = utcTime => {
    // let offset = new Date().getTimezoneOffset();
    // timestamp += offset * 60;
    // let date = new Date(timestamp * 1000);
    // return date.toISOString().match(/(\d{2}:\d{2})/)[0];
    let time = utcTime.split(" ")[1].substr(0, 5);
    let hour = parseInt(time.substr(0, 2));
    let newHour = hour > 12 ? hour - 12 : hour;
    let period = parseInt(time.substr(0, 2)) >= 12 ? "pm" : "am";
    if (newHour < 10) {
      return "0" + newHour + time.substr(2) + " " + period + " UTC";
    }
    return newHour + time.substr(2) + " " + period + " UTC";
  };
}

export default Weather;
