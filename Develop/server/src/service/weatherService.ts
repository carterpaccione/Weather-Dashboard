import dotenv from 'dotenv';

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
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class

class WeatherService {
// TODO: Define the baseURL, API key, and city name properties
  
  private baseUrl?: string;
  private apiKey?: string;
  private cityName: string = '';

  constructor() {
    this.baseUrl = BASE_API_URL || "";
    this.apiKey = API_KEY || "";
  }

// TODO: Create fetchLocationData method
   
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      console.log('Location data:', data);
      return data[0];
    } catch (error) {
      console.log('Error fetching location data:', error);
      return null;
    }
  }

// TODO: Create destructureLocationData method
  
  private async destructureLocationData(locationData: any): Promise<Coordinates | null> {
    if(!locationData) {
      return null;
    }
      const coordinates: Coordinates = {
      lat: locationData.lat,
      lon: locationData.lon
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
    // const weatherQuery = `${this.baseUrl}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    const weatherQuery =  `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return weatherQuery;
  }

// TODO: Create fetchAndDestructureLocationData method

  private async fetchAndDestructureLocationData(city: string) {
    const query = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(query);
    const data = await this.destructureLocationData(locationData);
    return data;
  }

// TODO: Create fetchWeatherData method

  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const weatherData = await response.json();
    // console.log('Weather data:', weatherData);
    return weatherData;
  }

// TODO: Build parseCurrentWeather method

  private parseCurrentWeather(response: any) {
  const currentWeather = new Weather(
    this.cityName,
    new Date(response.list[0].dt * 1000).toDateString(),
    response.list[0].weather[0].icon,
    response.list[0].weather[0].description,
    response.list[0].main.temp / 4,
    response.list[0].wind.speed,
    response.list[0].main.humidity,
  );
  console.log('Current weather:', currentWeather);
  return currentWeather;
  }

// TODO: Complete buildForecastArray method

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [currentWeather];
    
    for(let i = 8; i < weatherData.length; i+=8) {
      const forecastWeather = new Weather(
        this.cityName,
        new Date(weatherData[i].dt * 1000).toDateString(),
        weatherData[i].weather[0].icon,
        weatherData[i].weather[0].description,
        weatherData[i].main.temp / 4,
        weatherData[i].wind.speed,
        weatherData[i].main.humidity
      );
      forecastArray.push(forecastWeather);
    }
    console.log('Forecast array:', forecastArray);
    return forecastArray;
  }

// TODO: Complete getWeatherForCity method // Get lat and lon by city; Get forecast by lat and lon; Parse current weather; Build forecast array

  async getWeatherForCity(city: string) {
    this.cityName = city;

    if(!city) {
      throw new Error('No city provided');
    }
      try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      if(!coordinates) {
        throw new Error('Failed to retrieve coordinates');
      }

      const weatherData = await this.fetchWeatherData(coordinates);
      if(!weatherData) {
        throw new Error('Failed to retrieve weather data');
      }

      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
      return forecastArray;
    } catch (error) {
      console.log('Error getting weather data:', error);
      throw error;
    }
  };

}
export default new WeatherService();
