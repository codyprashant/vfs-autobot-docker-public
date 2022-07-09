require('dotenv').config();
const puppeteer = require("puppeteer");
const sleep = require('sleep');
const axios = require('axios').default;
var urlencode = require('urlencode');
const Xvfb = require('xvfb');
const { getFormattedDate } = require('../utils');
const { saveRecord } = require("./saveData");



const vfsAppointmentChecker =async (destination, origin, email, password, visaCategoryEnv, subCategoryEnv) =>{
  var xvfb = new Xvfb({
    silent: true,
    xvfb_args: ["-screen", "0", '1280x720x24', "-ac"],
});
xvfb.start((err)=>{if (err) console.error(err)})
    const browser = await puppeteer.launch({headless: false
    , devtools:true
      , args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security'
        ]
    });

    let token = "";
    const page = await browser.newPage();
    const page2 = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en' });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');
    console.log(`Logging into VFS Services... for ${email}`);
    console.log("Accessing VFS Page");
    await page.goto("https://visa.vfsglobal.com/ind/en/nld/login");
    await page.setViewport({ width: 1920, height: 929 });
    sleep.sleep('10');

    const loginRes = await axios.post('https://lift-api.vfsglobal.com/user/login', `username=${email}&password=${password}&missioncode=${destination}&countrycode=${origin}`);
      if(loginRes.status == 200){
        // console.log(loginRes.data)
        token = loginRes.data.accessToken
      }
      console.log(token)
      sleep.sleep('10');  

    let getLocations= await page2.evaluate(async (destination, origin) => { 
        const resp = await fetch(`https://lift-api.vfsglobal.com/master/center/${destination}/${origin}/en-US`);
        const jsonData = await resp.json();
        return jsonData;
     }, destination, origin); 
     console.log("Locations")
     sleep.sleep('5'); 

    for (let i = 0; i < getLocations.length; i++) {
        let getAppointmentCategory = await page.evaluate(async (destination, origin, getLocations, i) => { 
          const resp = await fetch(`https://lift-api.vfsglobal.com/master/visacategory/${destination}/${origin}/${getLocations[i].isoCode}/en-US`);
          const jsonData = await resp.json();
          return jsonData;
        },destination, origin, getLocations, i ); 
        console.log(`Category for ${getLocations[i].isoCode}`)
        sleep.sleep('5'); 

        for (let j = 0; j < getAppointmentCategory.length; j++) {
          if(visaCategoryEnv != 'NA') if(getAppointmentCategory[j].code != visaCategoryEnv) continue;
          let getVisaSubCategory = await page2.evaluate(async (destination, origin, getLocations, i, getAppointmentCategory, j) => { 
            const resp = await fetch(`https://lift-api.vfsglobal.com/master/subvisacategory/${destination}/${origin}/${getLocations[i].isoCode}/${getAppointmentCategory[j].code}/en-US`);
            const jsonData = await resp.json();
            return jsonData;
          },destination, origin, getLocations, i, getAppointmentCategory, j); 
          console.log(`SubCategory for ${getAppointmentCategory[j].code} of ${getLocations[i].isoCode}`)
          sleep.sleep('5'); 
          for (let k = 0; k < getVisaSubCategory.length; k++) {
            try{
              if(subCategoryEnv != 'NA') if(getVisaSubCategory[k].code != subCategoryEnv) continue;
              let formattedDate = await getFormattedDate();
              console.log(formattedDate)
              let url = `https://lift-api.vfsglobal.com/appointment/slots?countryCode=${origin}&missionCode=${destination}&centerCode=${urlencode(getLocations[i].isoCode)}&loginUser=${urlencode(email)}&visaCategoryCode=${urlencode(getVisaSubCategory[k].code)}&languageCode=en-US&applicantsCount=1&days=180&fromDate=${formattedDate}&slotType=2&toDate=28%2F12%2F2022`;
              console.log(url)
              if(token != ""){
                await page.evaluate((token, url, getAppointmentCategory, j, getVisaSubCategory, k, i) => { 
                    var xhr = new XMLHttpRequest;
                    var data = null;
                    xhr.open("GET", url);
                    xhr.setRequestHeader("authorization", token);
                    xhr.send(data);
                    xhr.onreadystatechange = async function() {
                      if (this.readyState == 4 && this.status == 200) {
                        var response = xhr.responseText;
                        console.log(response)
                        let jsonRes = JSON.parse(response);
                        let timeSlot = jsonRes[0]?.counters[0]?.groups[0]?.timeSlots[0]?.timeSlot ? jsonRes[0]?.counters[0]?.groups[0]?.timeSlots[0]?.timeSlot : "";
                        let totalSeats = jsonRes[0]?.counters[0]?.groups[0]?.timeSlots[0]?.totalSeats ? jsonRes[0]?.counters[0]?.groups[0]?.timeSlots[0]?.totalSeats : "" 
                        var data = {
                          "locationSelectionText" : jsonRes[0]?.center,
                          "categorySelectionText" : getAppointmentCategory[j]?.name,
                          "subCategorySelectionText" : getVisaSubCategory[k]?.name,
                          "statusResponsetext" : jsonRes[0]?.date,
                          "dateString": jsonRes[0]?.date,
                          "locationCode": i,
                          "availbileTime": timeSlot,
                          "availbileSlots" : totalSeats
                        }
                        console.log(data)
                        const resp = await fetch(`https://vfs-autobot2.herokuapp.com/api/v1/setSlots`, {
                        // const resp = await fetch(`http://localhost:5123/api/v1/setSlots`, {
                          method: 'POST',
                          mode: 'cors',
                          headers: {
                            'Content-Type': 'application/json',
                            "cache-control": "no-cache"
                          },
                          body : JSON.stringify(data)
                        });
                        const jsonData = await resp.json();
                        console.log(jsonData)

                        
                        // localStorage.removeItem("slotResponse");
                        // localStorage.setItem('slotResponse', response)
                      }
                    };
                }, token, url, getAppointmentCategory, j, getVisaSubCategory, k, i).then(r => console.log(r))
                
                sleep.sleep('10'); 

              } else{
                console.log("No Access Token")
                await browser.close()
                xvfb.stop();
              }
  
            } catch(error){
              console.log(error)
              await browser.close()
              xvfb.stop();
            }

          }  

        }
    }
    await browser.close()
    xvfb.stop();
}


module.exports = { vfsAppointmentChecker };