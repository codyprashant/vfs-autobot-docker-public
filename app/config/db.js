'use strict';

const mongoose = require('mongoose');

const dbURL = process.env.DB_URL

if (!dbURL) {
  // eslint-disable-next-line no-console
  console.error('DB URL empty');
  process.exit(1);
}

async function connectToDB() {
  // eslint-disable-next-line no-console
  console.log(`Connecting to Databse`);

  try {
    await mongoose.connect(dbURL);

    // eslint-disable-next-line no-console
    console.log('Successfully Connected To DB');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database Connection Failed');
    process.exit(1);
  }
}

connectToDB();

const db = mongoose.connection;

module.exports = db;
