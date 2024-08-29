import dotenv from 'dotenv';
import { query } from 'express';
dotenv.config();

const BASE_API_URL = process.env.BASE_API_URL;
const API_KEY = process.env.API_KEY;

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object

class Weather {
  date: string;
  temp: number;
  wind: number;
  humidity: number;

  constructor(date: string, temp: number, wind: number, humidity: number) {
    this.date = date;
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key properties
  
  private baseUrl?: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    baseUrl = BASE_API_URL || "",
    apiKey = API_KEY || ""
  }

// TODO: Create fetchLocationData method
   
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // TODO: Create destructureLocationData method
   
  private async destructureLocationData(locationData: any): Promise<Coordinates> {
    
    // locationData = await this.fetchLocationData(this.buildGeocodeQuery(city));
    const coordinates: Coordinates =  {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon
    }
    return coordinates;
  };

// TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    const geocodeQuery = (`${this.baseUrl}/geo/1.0/direct?q=${city}&appid=${this.apiKey}`);
    return geocodeQuery;
  }
// TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseUrl}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return weatherQuery;
  }
// TODO: Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData(city: string) {
      const locationData = await this.fetchLocationData(this.buildGeocodeQuery(city));
      const coordinates = await this.destructureLocationData(locationData);
      return coordinates;
    }
//   // TODO: Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates) {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      const weatherData = await response.json();
      return weatherData;
    }
//   // TODO: Build parseCurrentWeather method
     private parseCurrentWeather(response: any) {
      const parsedWeather = new Weather(
        response.dt,
        response.main.temp,
        response.wind.speed,
        response.main.humidity
      );
      return parsedWeather;
     }
// TODO: Complete buildForecastArray method
private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
  const forecastArray: Weather[] = [
    currentWeather,
    
  ];
  return forecastArray;
}
// TODO: Complete getWeatherForCity method // Get lat and lon by city; Get forecast by lat and lon; Parse current weather; Build forecast array
    async getWeatherForCity(city: string) {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = await this.parseCurrentWeather(weatherData);
      const forecastArray = await this.buildForecastArray(currentWeather, weatherData);
      return forecastArray
    }
};
export default new WeatherService();
