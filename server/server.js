const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const redis = require('redis');

const PORT_REDIS = process.env.PORT || 6379; 
const PORT = process.env.PORT || 3000;

const app = express();
const redis_client = redis.createClient(PORT_REDIS);

app.use(express.json());

app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

app.get('/help', (req, res, next) => {
    const heroId = Math.floor(Math.random() * (732 - 1) + 1);
    
    axios(`${process.env.API_PATH}/${heroId}`)
    .then(hero => {
        if (hero.data.name === undefined) {
            return next({
                log: 'ERROR: Invalid or unfound data from superhero api.',
                status: 400,
                message: { err: 'Request for help failed - please contact the superhero api documentation headquarters.'}
            })
        }
        const heroObj = {
            name: hero.data.name,
            biography: hero.data.biography,
            image: hero.data.image.url
        };
        res.status(200).json(heroObj);
    })
    .catch(err => console.log(err));
})

app.use('/', (req, res) => res.status(200).sendFile(path.join(__dirname, '../index.html')));

// unknown route handler
app.use('*', (req, res) => res.sendStatus(404));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
  log: 'Express error handler caught unknown middleware error',
  status: 400,
  message: { err: 'An error occurred' }, 
  }

  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

module.exports = app;