const mongoDB = require("mongodb");
const mongoClient = mongoDB.MongoClient;
const objId = mongoDB.ObjectId;
const dbUrl = process.env.DB_URL;
const LocationRecord = require('../models/locationRecord');
const { sendEmail, sendErrorEmail } = require("../utils");
const receiverEmail = process.env.RECEIVER_EMAIL
const alertMonths = process.env.ALERT_MONTHS
const sleep = require('sleep');



const saveData = async (req, res, next) => {
    try {
        const {locationSelectionText, categorySelectionText, subCategorySelectionText,
            statusResponsetext, dateString, locationCode, availbileTime, availbileSlots} = req.body
            console.log(req.body)

            console.log(locationSelectionText)
            console.log(categorySelectionText)
            console.log(subCategorySelectionText)
            console.log(statusResponsetext)
            console.log(dateString)
            console.log(locationCode)
            console.log(availbileTime)
            console.log(availbileSlots)
            let dataRecord = await saveRecord(locationSelectionText, categorySelectionText, subCategorySelectionText,
                statusResponsetext, dateString, locationCode, availbileTime, availbileSlots);
    //   res.json({ status:"SUCCESS"});
      res.json({ status:"SUCCESS" , message: dataRecord});
    } catch (error) {
      next(error);
    }
  };


const saveRecord = async (locationSelectionText, categorySelectionText, subCategorySelectionText,
     statusResponsetext, dateString, locationCode, availbileTime, availbileSlots) => {
        try{
            console.log(receiverEmail)
            let emails = receiverEmail.split(',');
            console.log(emails)
            console.log(alertMonths)
            let alMonths = alertMonths.split(',');
            let availble = new Date(statusResponsetext);
            if(alMonths.includes((availble.getMonth+1).toString())){
            // if(availble.getMonth+1 == 7){
                for (let k = 0; k < emails.length; k++) {
                    await sendEmail(locationSelectionText, statusResponsetext, availbileTime, emails[k])
                    sleep.sleep('10');
                }
            }
        }catch(error){
            console.log('Invalid Date')
            let emails = receiverEmail.split(',');
            await sendErrorEmail(locationSelectionText, statusResponsetext, availbileTime, emails[0], error)
        }
        

    try{
        let location = {
            "locationName": locationSelectionText,
            "category": categorySelectionText,
            "subCategory": subCategorySelectionText,
            "sourceCountry": "India",
            "destinationCountry": "Netherlands",
            "availbileDate":  dateString ,
            "availbilityRes": statusResponsetext,
            "locationCode": locationCode,
            "availbileTime":availbileTime,
            "availbileSlots":availbileSlots
        }
        console.log("Adding Record")
        let locationRecord = new LocationRecord(location);
        // console.log(locationRecord);
        let result = await locationRecord.save();
        console.log(result);
    } catch(error){
        console.log(error);
    }
}

module.exports = { saveRecord, saveData };

