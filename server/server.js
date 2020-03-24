const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRouter = require('./routes/apiRouter.js');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

app.use('/help', apiRouter);

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