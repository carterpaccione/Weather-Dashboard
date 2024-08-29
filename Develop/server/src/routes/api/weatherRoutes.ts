import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const city = req.body.city;
  const weather = new WeatherService(city);
  const response = await WeatherService.getWeatherForCity(city);
  return response;
});
// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
  
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if(!req.params.id) {
      throw new Error('No city ID provided');
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City removed from history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


export default router;
