import app from "./app";
import './database';
import './cronjobs';
import dotenv from 'dotenv';
dotenv.config();
import cron from 'node-cron';

function init() {
  app.listen(app.get('port'));
  console.log("server on port", app.get('port'));
  // cronjobs();
}

// function cronjobs() {
//   cron.schedule("* * * * * *", function() {
//     console.log('task every second');
//   })
// }

init();
