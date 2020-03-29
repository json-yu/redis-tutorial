const apiController = {};
const axios = require('axios');
const redis = require('redis');

const PORT_REDIS = process.env.PORT || 6379; 

const redis_client = redis.createClient(PORT_REDIS);

apiController.checkCache = (req, res, next) => {
  const { id } = req.params;
  
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

    redis_client.setex(hero.data.id, 3600, JSON.stringify(heroObj));

    res.locals.hero = heroObj;

    return next();
  })
  .catch(err => console.log(err));
};

module.exports = apiController;