import React, { Component } from "react";
import $ from "jquery";
import "./index.css";
import Summary from "./Summary";
// import Graph from "./Graph";
import Footer from "./Footer";

const API = "http://api.openweathermap.org/";
const API_KEY = "YOUR_API_KEY";

class Weather extends Component {
  state = {};
  render() {
    if (this.state.city === undefined) {
      return null;
    }
    return (
      <div className="main-container">
        <Summary city={this.state.city} weather={this.state.currentWeather} />
        <Footer data={this.state} onDayChange={this.handleDayChange} />
      </div>
    );
  }

  componentDidMount() {
    console.log("Component mounted");
    this.getGeoLocation();
  }

  handleDayChange = index => {
    let newCurrentWeather = this.state.weatherDetails[index];
    $(".icon-block").removeClass("active");
    $(".icon-block-" + index).addClass("active");
    this.setState({
      currentWeather: newCurrentWeather
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
    alert("ERROR ", error.code);
  };

  getWeatherForecast = (lat, lon) => {
    let self = this;
    $.getJSON(
      `${API}data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    ).then(res => self.processResponse(res));
  };

  processResponse = response => {
    console.log(response);
    let self = this;
    let city = { name: response.city.name, country: response.city.country };
    let weatherDetails = response.list.map(function(weather) {
      var details = {
        day: self.getDay(weather.dt),
        time: self.getTime(weather.dt_txt),
        min_temp: Math.round(weather.main.temp_min - 273.15),
        max_temp: Math.round(weather.main.temp_max - 273.15),
        temp: Math.round(weather.main.temp - 273.15),
        humidity: weather.main.humidity,
        wind: Math.round(weather.wind.speed * 3.6),
        weather_condition: weather.weather[0].main,
        weather_description: weather.weather[0].description,
        percipitation: weather.clouds.all
      };
      return details;
    });
    this.setState({
      city,
      weatherDetails,
      currentWeather: weatherDetails[0]
    });
    console.log(weatherDetails);
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
    let period = parseInt(time.substr(0, 2)) >= 12 ? "pm" : "am";
    return time + " " + period + " UTC";
  };
}

export default Weather;
