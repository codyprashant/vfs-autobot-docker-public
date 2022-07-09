'use strict';

const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const options = { timestamps: true};

const getRequiredFiledMessage = (filed) => {
  const message = `${filed} Should Not Be Empty`;
  return [true, message];
};

const LocationRecord = new Schema({
  id: { type: String, default: uuid, unique: true },
  locationName: {
    type: String,
    required: getRequiredFiledMessage('locationName'),
    trim: true,
  },
  category: {
    type: String,
    required: getRequiredFiledMessage('category'),
    trim: true,
  },
  subCategory: {
    type: String,
    required: getRequiredFiledMessage('subCategory'),
    trim: true,
  },
  sourceCountry: {
    type: String,
    required: getRequiredFiledMessage('sourceCountry'),
  },
  availbilityRes: {
    type: String,
    trim: true,
  },
  availbileDate: {
    type: String,
    trim: true,
  },
  availbileTime: {
    type: String,
    trim: true,
  },
  availbileSlots: {
    type: String,
    trim: true,
  },
  destinationCountry: {
    type: String,
    required: getRequiredFiledMessage('destinationCountry'),
  },
  locationCode: {
    type: String,
    required: getRequiredFiledMessage('locationCode'),
  },
  recordChecked: { type: Date, default: Date.now },
}, options);

module.exports = mongoose.model('LocationRecord', LocationRecord);
