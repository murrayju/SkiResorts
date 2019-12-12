import { getData } from './scraper';
import resorts from './resorts';

export const startScraperCron = db => {
  console.log(db);
  const getAllData = () => {
    Object.keys(resorts).forEach(async resort => {
      const data = await getData(resorts[resort]);
      console.info(resort, data);
    });
  };

  return setInterval(getAllData, 60 * 60 * 1000);
};
