const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

const config = {
    name: 'mustang-go-app',
    port: 8000,
    host: '0.0.0.0',
  };

const app = express();
const routes = require('./routes');

const logger = log({ console: true, file: false, label: config.name });

// specify middleware to use
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.urlencoded());  // To parse URL-encoded bodies
app.use(express.json()); //To parse JSON bodies
app.use(cors({
  origin: '*'
}));

routes(app, logger);

app.listen(config.port, config.host, (e) => {
    if (e) {
      throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
  });