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
  // TODO: Define the baseURL, API key, and city name properties
  
  private baseUrl?: string;
  private apiKey?: string;
  city: string;

  constructor(baseUrl: string, apiKey: string, city: string, lat: number, lon: number) {
    this.baseUrl = BASE_API_URL || "",
    this.apiKey = API_KEY || "",
    this.city = city
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
   
  private async destructureLocationData(locationData: Coordinates): Promise<Coordinates> {
    
    locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    const coordinates: Coordinates = {
      lat: locationData.lat,
      lon: locationData.lon
    }
    return coordinates;
  };

// TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = (`${this.baseUrl}/geo/1.0/direct?q=${this.city}&appid=${this.apiKey}`);
    return geocodeQuery;
  }
// TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseUrl}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return weatherQuery;
  }
// TODO: Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData() {
      const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
      const coordinates = await this.destructureLocationData(locationData);
      return coordinates;
    }
//   // TODO: Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates) {
      const coords = await this.fetchAndDestructureLocationData();
      const response = await fetch(this.buildWeatherQuery(coords));
      const weatherData = await response.json();
      return weatherData;
    }
//   // TODO: Build parseCurrentWeather method
     private parseCurrentWeather(response: any) {
      const currentWeather = await fetchWeatherData(coordinates);
      new Weather(
        response.dt,
        response.main.temp,
        response.wind.speed,
        response.main.humidity
      );
      return currentWeather;
     }
// TODO: Complete buildForecastArray method
      private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
        const currentWeather = await this.parseCurrentWeather(weatherData);

      }
// TODO: Complete getWeatherForCity method
    async getWeatherForCity(city: string) {

    }
};
export default new WeatherService();
