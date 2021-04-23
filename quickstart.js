const {google} = require('googleapis');
var cron = require('node-cron');
const youtube = google.youtube({version: 'v3',auth: 'AIzaSyDJVXYIZZfuSFgTzI5jxvIP6mECnCLIPp0'});
  
async function main() {
const res = await youtube.search.list({
    part: 'id,snippet',
    q: 'football',
    order: "date",
    type: ["video"],
    publishedAfter: "2021-03-22T19:18:44.335Z",
});
console.log(res.data.items);
};
main().catch(console.error);

//   cron.schedule('* * * * *', () => {
//     console.log('running a task every minute');
//   });