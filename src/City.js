// City.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./City.css"; // Import CSS file for City component styling

const City = ({ handle }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${page}`
        );
        const newCities = response.data.results;
        setCities((prevCities) => [...prevCities, ...newCities]);
        setLoading(false);
        if (newCities.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (observer.current) {
      observer.current.observe(document.querySelector(".observer"));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  const handleWeather = (cityName) => {
    handle(cityName);
  };

  return (
    <div className="city-container"> {/* Added a container class */}
     <h2 className="" style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
     List of Cities  
          </h2>
      <table className="city-table"> {/* Added a table class */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Population</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr key={index} onClick={() => handleWeather(city.ascii_name)}>
              <td>{city.ascii_name}</td>
              <td>{city.cou_name_en}</td>
              <td>{city.population}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
      <div className="observer" style={{ height: "10px" }}></div>
      {!hasMore && <p>No more data available</p>}
    </div>
  );
};

export default City;
