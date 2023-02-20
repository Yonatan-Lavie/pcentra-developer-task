import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './App.css';

function App() {
  // define loaction state variable
  const [location, setlocation] = useState({
    isAccessable: false,
    coords: {
      lat: 0,
      lon: 0,
    },
  });
  // hold the search results
  const [results, setResults] = useState([]);
  // checkboxs form
  const { register, handleSubmit } = useForm();

  // geo location config , success and error headlers
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const error = (err) => {
    const PERMISSION_DENIED = 1;
    const POSITION_UNAVAILABLE = 2;
    const TIMEOUT = 3;

    switch (err.code) {
      case PERMISSION_DENIED:
        alert(
          'PERMISSION DENIED - Please enable shearing location to get results!'
        );
        break;
      case POSITION_UNAVAILABLE:
        alert("POSITION_UNAVAILABLE - can't locate device location.");
        break;
      case TIMEOUT:
        alert('TIMEOUT - sumting went worng please try later.');
        break;

      default:
        break;
    }
  };
  const success = ({ coords }) => {
    setlocation({
      ...location,
      coords: {
        lat: coords.latitude,
        lon: coords.longitude,
      },
    });
  };

  const fetchStations = async (attributes) => {
    navigator.geolocation.getCurrentPosition(success, error, options);
    // arranging params for request
    let params = {
      lat: location.coords.lat,
      lon: location.coords.lon,
      radius: 5000,
    };

    params = { ...params, ...attributes };
    console.log(params);

    const respons = await axios.get('http://localhost:8080/api/search/', {
      params: params,
    });

    console.log(respons.data.results);
    // update results with respons
    setResults(respons.data.results);
  };
  // handle form submition
  const onSubmit = (data) => {
    // convert form attributs from object to array with only the true attributs
    const attributes = Object.entries(data)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => value === true)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    fetchStations(attributes);
  };
  // print results for developer
  const printResults = () => {
    const renderAddress = (address, city) => {
      if (address !== '' && city !== '') {
        return `${address} , ${city}`;
      } else if (address !== '') {
        return `${address}`;
      } else {
        return `${city}`;
      }
    };
    return results.map((item, key) => (
      <div key={key} className="result-item">
        <p>{'מטר ' + item.distance}</p>
        <p>{item.service_station.comments}</p>
        {item.service_station.attributes.map((item, key) => {
          return <div key={'attribute-' + key}>{item}</div>;
        })}
        <p>
          {renderAddress(
            item.service_station.address,
            item.service_station.city
          )}
        </p>
        <p>{item.service_station.activity_hours}</p>
      </div>
    ));
  };

  return (
    <div className="main-container">
      <div className="col">
        <div className="page-title">Search Service Stations Nearby</div>
      </div>
      <div className="col">
        <form className="form-wrapper" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-item">
            <input type="checkbox" {...register('accepts_credit_card')} />
            <label htmlFor="accepts_credit_card">Accepts Credit Card</label>
          </div>
          <div className="form-item">
            <input type="checkbox" {...register('accepts_cash')} />
            <label htmlFor="accepts_cash">Accepts Cash</label>
          </div>
          <div className="form-item">
            <input type="checkbox" {...register('ravkav_services')} />
            <label htmlFor="ravkav_services">Ravkav Services</label>
          </div>
          <div className="form-item">
            <input type="checkbox" {...register('sells_ravkav_reader')} />
            <label htmlFor="sells_ravkav_reader">Sells Ravkav Reader</label>
          </div>
          <div className="form-item">
            <input type="checkbox" {...register('manned')} />
            <label htmlFor="vehicle1">Manned</label>
          </div>
          <div className="form-item">
            <div style={{ flex: 10 }}>
              <input type="checkbox" {...register('reload_reservation')} />
              <label htmlFor="reload_reservation">Reload Reservation</label>
            </div>

            <input className="form-submit-btn" type="submit" value="Search" />
          </div>
        </form>
      </div>
      <div className="col">{printResults(results)}</div>
    </div>
  );
}

export default App;
