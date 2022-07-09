'use strict';

require('dotenv').config();
require('./app/config/db');
var cron = require('node-cron');
const { vfsAppointmentChecker } = require('./app/controllers/vfsAppointmentChecker');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const destination = process.env.DESTINATION_COUNTRY
const origin = process.env.SOURCE_COUNTRY
const email  = process.env.VFS_EMAIL
const password = process.env.VFS_PASSWORD
const visaCategoryEnv = process.env.VISA_CATEGORY || 'NAPP'
const subCategoryEnv = process.env.SUB_CATEGORY || 'NAPP'


const PORT = process.env.PORT || 5000;
// const IP = config.get('IP');
const app = express();

app.use(helmet());
// app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./app/routes')(app);

const onServerStart = () => {
  const ENVIROINMENT = process.env.NODE_ENV || 'development';
  const message = `Server Listening On Port ${PORT}, ENVIROINMENT=${ENVIROINMENT}`;
  // eslint-disable-next-line no-console
  console.log(message);
};

app.listen(PORT, onServerStart);

vfsAppointmentChecker(destination, origin, email, password, visaCategoryEnv, subCategoryEnv);
// // cron.schedule('0 1-23 * * *', () => { \\ every hour
cron.schedule('10 * * * * ', () => {  
  console.log(vfsAppointmentChecker(destination, origin, email, password, visaCategoryEnv, subCategoryEnv));
});

