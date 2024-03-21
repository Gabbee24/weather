'use client'
import Spinner from "@/components/ui/Spinner";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCloudSunRain } from "react-icons/fa6";
import { FaCloudSun } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

function getCurrentDate() {
  // return <h1>Hello date</h1>
  const currentDate = new Date();
  const options = { month: "long" };
  const monthName = currentDate.toLocaleString("en-us", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherdata, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  
  function handleNewCity(e) {
    const { name, value } = e.target
    setCity(prevCity => (
      {
        ...prevCity,
        [name]: value
      }
    ))
  }

  async function fetchData(cityName) {
    try {
      const res = await fetch(`http://localhost:3000/api/weather?address=${cityName}`, {
        cache: "no-store",
      });
      // if(!res.ok){
      //   return notFound();
      // }
      // return res.json();

      const jsonData = (await res.json()).data;
      setWeatherData(jsonData);

    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDataByCoordinates(latitude,longitude) {
    try {
      const res = await fetch(`http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`, {
        cache: "no-store",
      });
      const jsonData = (await res.json()).data;
      setWeatherData(jsonData);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // fetchData("lahore");
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        fetchDataByCoordinates(latitude,longitude);
      },(error) => {
        console.log(error);
      })
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchData(city);
    setCity('')
  };


  return (
    <div className="flex justify-between items-center p-3 min-h-screen" >

      {/* <h1>{weatherdata?.name}</h1> */}
      <div className="p-9 mx-auto h-[30rem] max-w-screen md:w-96 bg-gradient-to-b from-green-500 to-[#442bb2] cursor-pointer rounded-xl shadow-2xl " >

        <form onSubmit={handleSubmit} className="flex-col flex justify-center my-8 items-center" >
          <span className="flex w-full " >
            <input
              type="text"
              placeholder="Enter city name"
              className="rounded-full p-3 text-black w-96 focus:outline-none "
              name="city"
              required
              onChange={(e) => setCity(e.target.value)}
              value={city}
              autoComplete="off"
            />
            <button className=" p-3 rounded-lg disabled:opacity-50 " type="submit" ><CiSearch fontSize='2em' color="white" /></button>
          </span>
        </form>

        {
          weatherdata?.weather[0] ? (
            <>
              <div className="flex justify-evenly " >
                <div>
                  <span>
                    {
                      weatherdata?.weather[0]?.description === "rain" ||
                        weatherdata?.weather[0]?.description === "fog" ?

                        <FaCloudSun color="white" fontSize='5.5em' /> : < FaCloudSunRain color="white" fontSize='5.5em' />
                    }
                  </span>
                </div>

                <div className="font-bold text-white mt-3 " >
                  <div>
                    <span className="text-4xl" >
                      {(weatherdata?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176)}
                    </span>
                  </div>
                  <div>
                    {weatherdata?.weather[0]?.description?.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center text-white " >
                <p className="font-bold text-3xl" >{weatherdata?.name}</p>
                <div>{date}</div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center" >
              <Spinner />
            </div>
          )
        }
      </div>
    </div>
  );
}
