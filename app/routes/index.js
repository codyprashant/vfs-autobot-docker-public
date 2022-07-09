'use strict';
const errorHandlingMiddleware = require('../lib/error-handling-middleware');
const { connectionCheck } = require('../controllers/healthCheck');
const { saveData } = require('../controllers/saveData');


module.exports = (app) => {
  app.post('/api/v1/setSlots', saveData);
  app.get('/', connectionCheck);
  app.use(errorHandlingMiddleware);
};
