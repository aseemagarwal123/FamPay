const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./logger');
const appRoutes = require('./routes');
const {google} = require('googleapis');
var cron = require('node-cron');
const youtube = google.youtube({version: 'v3',auth: process.env.API_KEY});
const {videoInsertMany} = require('./controllers/videoController');
const app = express();
const NodeCache = require( "node-cache" );
const cache = new NodeCache();



app.use(morgan(function(tokens, req, res) {
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    'time': tokens['date'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
  });
}, {stream: logger.stream}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', async (req, res)=>{
  res.status(200).send({'message': 'service is up'});
});

app.use('/api', appRoutes);

// 404 error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log(err);
  return res.status(err.status || 500).send({'message': err.message || 'Internal Server Error'});
});

async function main() {
  var query = {
    part: 'id,snippet',
    q: 'football',
    order: "date",
    type: ["video"],
    publishedAfter: "2021-03-22T19:18:44.335Z" 
  }
  var cacheData = cache.get("token");
  if (cacheData != undefined){
    query.pageToken = cacheData.token;
  }
  const res = await youtube.search.list(query);
  console.log(res.data)
  console.log(query)

  if(res.data.nextPageToken){
    cache.set("token", {'token':res.data.nextPageToken}, 10000);
  }
  //videoInsertMany(res.data.items);
};

  
// cron.schedule('*/2 * * * *', () => {
//   main().catch(console.error);
// });
module.exports = app;
