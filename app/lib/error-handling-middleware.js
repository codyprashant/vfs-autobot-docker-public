/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

'use strict';

// eslint-disable-next-line no-unused-vars
function errorHandlingMiddleware(error, req, res, next) {
  console.error(error);
  if (error.name === 'ValidationError') {
    const keys = Object.keys(error.errors);
    const errorMessages = keys
      .map((key) => error.errors[key].message)
      .filter((message) => message)
      .toString();

    error.message = errorMessages;
    error.status = 400;
  }

  if (error.name === 'MongoError' && error.code === 11000) {
    error.status = 409;
  }

  const { status = 500, message = 'Something Went Wrong' } = error;
  res.status(status).json({ message });
}

module.exports = errorHandlingMiddleware;
