import './App.css'
import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import clearIcon from "./assets/clearIcon.png"
import cloudyIcon from "./assets/cloudyIcon.png"
import drizzleIcon from "./assets/drizzleIcon.png"
import snowIcon from "./assets/snowIcon.png"
import rainIcon from "./assets/rainIcon.png"
import humidityIcon from "./assets/humidityIcon.png"
import windIcon from "./assets/windIcon.png"

const WeatherIcon = (props) => {
  return (
    <>
    <div className="weather-icon-div">
      <img src={props.icon} className='weather-icon' alt="" />
    </div>
    </>
  )
}

const WeatherDetails = (props) => {
  return (
    <>
    <p className='weather-celcius'>{props.temp}° c</p>
    <h2 className='district'>{props.city}</h2>
    <span className='country'>{props.country}</span>
    <div className="weather-tude">
      <div className="latitude">
        <span>Latitude</span>
        <h5 className='lati-value'>{props.lat}</h5>
      </div>
      <div className="longitude">
        <span>Longitude</span>
        <h5 className='longi-value'>{props.long}</h5>
      </div>
    </div>
    <div className="other-details">
      <div className="humidity-div">
        <img src={humidityIcon} className='humidity-wind' alt="" />
        <h6 id='humidity-value'>{props.humidity}%</h6>
        <span>Humidity</span>
      </div>
      <div className="windspeed-div">
        <img src={windIcon} className='humidity-wind' alt="" />
        <h6 id='windspeed-value'>{props.windspeed} Km/h</h6>
        <span>Wind Speed</span>
      </div>
    </div>
    </>
  )
}

function App() {
  let Api_id = "73b5f2d420c74e585bc18a85a11f906f"
  const [Icon,setIcon] = useState(clearIcon)
  const [Temp,setTemp] = useState(0)
  const [Lat,setLat] = useState(0)
  const [Long,setLong] = useState(0)
  const [Country,setCountry] = useState('ind')
  const [City,setCity] = useState('')
  const [Humidity,setHumidity] = useState(0)
  const [Windspeed,setWindspeed] = useState(0)
  const [SearchText,setSearch] = useState("Kanchipuram")
  const [Loading,setLoading] = useState(false)
  const [Cnotfound,setCityNotFound] = useState(false)
  const [ApiError,setErrormsg] = useState("")
  const [ErrorConfirm,setApiError] = useState(false)

  const weatherIconCode = {
    "01d" : clearIcon ,
    "01n" : clearIcon ,
    "02d" : cloudyIcon ,
    "02n" : cloudyIcon ,
    "03d" : drizzleIcon ,
    "03n" : drizzleIcon ,
    "04d" : drizzleIcon ,
    "04n" : drizzleIcon ,
    "09d" : rainIcon ,
    "09n" : rainIcon ,
    "10d" : rainIcon ,
    "10n" : rainIcon ,
    "13d" : snowIcon ,
    "13n" : snowIcon ,
  }

  async function callApi(){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${SearchText}&appid=${Api_id}&units=Metric`
    setLoading(true)
    try{
      let response = await fetch(url)
      let data = await response.json()
      console.log(data)
      if(data.cod === "404"){
        setCityNotFound(true)
      }else{
        setCityNotFound(false)
      }
      setCity(SearchText)
      setCountry(data.sys.country)
      setHumidity(data.main.humidity)
      setTemp(data.main.temp)
      setLong(data.coord.lon)
      setLat(data.coord.lat)
      setWindspeed(data.wind.speed)
      setErrormsg("")
      setApiError(false)
      const iconCode = weatherIconCode[data.weather[0].icon] || clearIcon
      setIcon( iconCode )

    }catch(error){
      setApiError(true)
      setErrormsg("Unable to Fetch API :"+error)
    }
    finally{
      setLoading(false)
    }
  }
  function handleSearch(e){
    setSearch(e.target.value)
  };
  function keyDownEvent(e){
    if(e.key === "Enter"){
      callApi()
    }
  }

  useEffect( function() {
    callApi();
  },[]);

  return (
    <>
<div className="container-fluid py-5">
  <div className="weather-card">
   <div className="search-box">
    <input type="text" name="search-inp" placeholder='Search City' id="search-inp" value={SearchText} onChange={handleSearch} onKeyDown={keyDownEvent}/>
    <button type='button' id='search-btn' onClick={callApi}><i className="bi bi-search"></i></button>
   </div>
   {(!Loading && !Cnotfound) && <WeatherIcon icon={Icon}/>}
   <main>
    { (!Loading && !Cnotfound) && <WeatherDetails temp={Temp} lat={Lat} long={Long} city={City} country={Country} humidity={Humidity} windspeed={Windspeed}/>}
   </main>
   {Loading && <div id="loading-msg">Loading...</div>}
   {Cnotfound && <div id="city-error">City Not Found</div>}
   {ErrorConfirm && <div id="api-error-msg">{ApiError}</div>}
   <footer>
    <p>Designed By <strong>@Dhanasekar</strong></p>
   </footer>
  </div>
</div>
    </>
  )
}

export default App

App.prototype = {
  icon : PropTypes.string.isRequired,
  temp : PropTypes.number.isRequired,
  lat : PropTypes.number.isRequired,
  long : PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country : PropTypes.string.isRequired,
  humidity : PropTypes.number.isRequired,
  windspeed : PropTypes.number.isRequired,
}