import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import "./App.css"; // Make sure to uncomment if you have styles defined here
import City from "./City";
import "./Forecast.css";

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  });
  const [forecast, setForecast] = useState({
    loading: false,
    data: null,
    error: false,
  });

  const toDateFunction = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const search = async (event) => {
    if (event.key === "Enter") {
      setWeather({ ...weather, loading: true });
      setForecast({ ...forecast, loading: true });

      const url = "https://api.openweathermap.org/data/2.5/weather";
      const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
      const apiKey = "f00c38e0279b7bc85480c3fe775d518c";

      try {
        const response = await axios.get(url, {
          params: {
            q: input,
            units: "metric",
            appid: apiKey,
          },
        });

        setWeather({ data: response.data, loading: false, error: false });
        setInput("");

        const forecastResponse = await axios.get(forecastUrl, {
          params: {
            q: input,
            units: "metric",
            appid: apiKey,
          },
        });

        setForecast({
          data: forecastResponse.data.list,
          loading: false,
          error: false,
        });
      } catch (error) {
        setWeather({ data: null, loading: false, error: true });
        setForecast({ data: null, loading: false, error: true });
        setInput("");
        console.error("Error fetching weather data:", error);
      }
    }
  };

  const handleWeather = async (cityName) => {
    setInput(cityName);
    await search({ key: "Enter" });
  };

  return (
    <>
      {weather.data && (
        <div className="App">
          <h1 className="" style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold" }}>
            Weather Forecast
          </h1>
          <br />
          <div className="search-bar" style={{ width: "60%", margin: "auto", marginBottom: "20px" }}>
            <input
              type="text"
              className="city-search"
              placeholder="Enter City Name.."
              name="query"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyPress={search}
              style={{ border: "1px solid white", padding: "7px", width: "100%", borderRadius: "10px", fontSize: "16px" }}
            />
          </div>

          {weather.loading && (
            <div className="loading-spinner" style={{ marginTop: "50px" }}>
              <Oval type="Oval" color="black" height={50} width={50} />
            </div>
          )}

          {weather.error && (
            <div className="error-message" style={{ marginTop: "40px", display: "flex" }}>
              <FontAwesomeIcon icon={faFrown} style={{ fontSize: "30px" }} />
              <span style={{ fontSize: "20px", marginLeft: "10px" }}>City not found</span>
            </div>
          )}

          {weather.data && (
            <div className="box w-full" style={{ width: "60%" }}>
              <div className="city-name">
                <h2 style={{ textAlign: "center", paddingTop: "25px", fontSize: "25px", fontWeight: "bold" }}>
                  {weather.data.name}, <span>{weather.data.sys.country}</span>
                </h2>
              </div>

              <div className="date" style={{ textAlign: "center", marginTop: "15px" }}>
                <span>{toDateFunction()}</span>
              </div>
              <div className="icon-temp" style={{ width: "250px", margin: "auto", textAlign: "center", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <div>
                  <img
                    className=""
                    src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                    alt={weather.data.weather[0].description}
                    style={{ fontSize: "50px" }}
                  />
                </div>
                <div className="" style={{ fontSize: "30px", fontWeight: "bold" }}>
                  {Math.round(weather.data.main.temp)}°c
                </div>
              </div>

              <div className="des-wind" style={{ marginTop: "10px" }}>
                <p style={{ textAlign: "center" }}>{weather.data.weather[0].description.toUpperCase()}</p>
                <p style={{ textAlign: "center", marginTop: "10px", color: "black" }}>Wind Speed: {weather.data.wind.speed}m/s</p>
              </div>
            </div>
          )}

          {forecast.data && (
            <div className="forecast-container">
              {forecast.data.map((forecastItem, index) => (
                <div key={index} className="forecast-item">
                  <p>{forecastItem.dt_txt}</p>
                  <p>Temperature: {forecastItem.main.temp}°C</p>
                  <p>Description: {forecastItem.weather[0].description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <City handle={handleWeather} />
    </>
  );
}

export default App;
