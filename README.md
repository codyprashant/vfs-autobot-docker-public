# VST Slot Tracker
This Autobot is written as MERN for getting slots on scheduled manner by fetching the information from VFS Global site.

Related Projects are available at below projects for frontend to visualize data

- Backend for Frontend component : - [Git Repo](https://github.com/codyprashant/vfs-tracker) 
- Frontend for Slots Tracking : - [Git Repo](https://github.com/codyprashant/vfs-tracker-FE) | [Live Site](https://vfsslot-tracker.netlify.app/) 
We will merge all three project soon in future.

## How to run locally

- Clone the project
- Run `npm start`
- Create .env file and place below properties


| Name | Value |
| ------ | ------ |
| VFS_EMAIL | Registered email id on VFS |
| VFS_PASSWORD | Password of registered email |
| SENDGRID_API_KEY | API key of Sendgrid account. If you dont have account you can create https://signup.sendgrid.com/ |
| SENDER_EMAIL | Email Id from which email will be sent |
| RECEIVER_EMAIL | Email Id on which email will be sent in case of alerts |
| DB_URL | MongoDB connection URL  |
| NODE_ENV | Environment you eant to put like 'Production' |
| SOURCE_COUNTRY | Source Country code form VFS site |
| DESTINATION_COUNTRY | Destination Country code form VFS site |
| PORT | Port no on which you ant to run service |
| SUB_CATEGORY | (Optional) Use this to fetch records only for specific Sub Visa Category  |
| VISA_CATEGORY | (Optional) Use this to fetch records only for specific Visa Category |
| ALERT_MONTHS | Month Number for which you eant to receive alerts ('2,3,4')[comma seperate values are allowed in case of multiple months] |


Markdown is a lightweight markup language based on the formatting conventions
that people naturally use in email.
As [John Gruber] writes on the [Markdown site][df1]

- After creating .env file run npm start

## Creating Docker 
- After testing the app locally set the environment variables to `DockerFile`.
- Run the command to build image from Root Directory.
- Once the Docker is ready, try running it.
