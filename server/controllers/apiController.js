const axios = require('axios'); 
const redis = require('redis'); // make sure to require redis

const PORT_REDIS = process.env.PORT || 6379; // set the port for the Redis client

const redis_client = redis.createClient(PORT_REDIS); // initialie the Redis client

const apiController = {};

/*
this controller checks for cached data. If it finds any,
it will send that data back to the client instead of 
moving on to the callForHelp function
*/
apiController.checkCache = (req, res, next) => {
  const { id } = req.params;
  
  // We use the id that was stored when setting our data into the cache to find the key-value pair
  redis_client.get(id, (err, data) => {
    if (err) {
      return next({
        log: `ERROR: Invalid or unfound data from redis client.`,
        status: 500,
        message: { err: 'Something went wrong with the data cache. Check the server log for details.'}
      })
    };

    if (data) {
      const heroData = JSON.parse(data);
      res.status(200).json(heroData);
    }
    else return next();
  });
};

//
apiController.callForHelp = (req, res, next) => {
  const heroId = 659; // 659 is the id for Thor
  const hero_path = `${process.env.API_PATH}/${heroId}`;

  axios(hero_path)
  .then(hero => {
    if (hero.data.name === undefined) {
      return next({
        log: 'ERROR: Invalid or unfound data from superhero api.',
        status: 400,
        message: { err: 'Request for help failed - please contact the superhero api documentation headquarters.'}
      })
    };

    const heroObj = {
      id: hero.data.id,
      name: hero.data.name,
      biography: hero.data.biography,
      image: hero.data.image.url
    };

    // Here is where we set our data into Redis using a unique ID,
    // the expiration interval, and the data to be stored
    redis_client.setex(hero.data.id, 3600, JSON.stringify(heroObj));

    res.locals.hero = heroObj;

    return next();
  })
  .catch(err => console.log(err));
};

module.exports = apiController;