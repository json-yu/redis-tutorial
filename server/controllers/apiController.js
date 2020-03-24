const apiController = {};
const axios = require('axios');
const redis = require('redis');

const PORT_REDIS = process.env.PORT || 6379; 

const redis_client = redis.createClient(PORT_REDIS);

apiController.checkCache = (req, res, next) => {
    return next();
}

apiController.callForHelp = (req, res, next) => {
  const heroId = req.body.random ? Math.floor(Math.random() * (732 - 1) + 1) : 659; // 659 is the id for Thor
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
    console.log(res.locals.hero);

    return next();
  })
  .catch(err => console.log(err));
}



module.exports = apiController;