import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: any;
  constructor(name: string, id: any) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
   private async read() {
    return await fs.readFile('db/searchHistory.json', 'utf8');
   }
  
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, `\t`));
   }
  
   // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
      return await this.read().then ((cities) => {
        let parsedCities: City[];
  
        try {
          parsedCities = [].concat(JSON.parse(cities));
          console.log(parsedCities);
        } catch (error) {
          parsedCities = [];
        }
        console.log(parsedCities);
        return parsedCities; 
      });
  }
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if(!city) {
      throw new Error('City is required');
    }
      const newCity: City = {
        name: city,
        id: uuidv4(), // Generate a unique ID using uuid,
      };
      console.log(newCity);
      return await this.getCities()
        .then((cities) => {
          for(let i = 0; i < cities.length; i++) {
            if (cities[i].name === city) {
              throw new Error('City already exists');
            } 
          }
          let updatedCities = cities.concat(newCity);
          console.log(updatedCities);
          return this.write(updatedCities);
        });
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
   async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((updatedCities) => this.write(updatedCities));
   }
}

export default new HistoryService();
