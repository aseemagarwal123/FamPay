const createError = require('http-errors');
const {video} = require('../models/video');
const {HttpCodes, CustomErrors}=require('../response');
const jwt = require("jsonwebtoken");
const _  = require('lodash');



async function videoInsertMany(items) {
    try {
        let videoArray = []
        _.map(items,(item) => {
            let object = {
                title:item.snippet.title,
                description:item.snippet.description,
                published_datetime:item.snippet.publishedAt,
                thumbnails:item.snippet.thumbnails
            }
            videoArray.push(object)
        })
        let multipleVideos = await video.insertMany(videoArray);
        console.log(multipleVideos)
    } catch (err) {
      logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}



async function videoGetAll(req, res, next) {
    const page = Number(req.query.limit) * ((req.query.page) - 1) || 0;
    const limit = Number(req.query.limit) || 10;
    try {
     query={};
     if(req.query.search) {
        query = {$text:{$search:req.query.search,$caseSensitive:false}};
     } 
     var videos = await video.find(query).sort({published_datetime:-1}).skip(page).limit(limit);
     var count = await video.count(query);
     return res.status(HttpCodes.OK).send({
        'response': {
          'message': 'videos fetched',
          'result': {
            'video': videos,
            'count': count
          }
        },
      });
    } catch (ex) {
      next(ex)
    }
}

module.exports = {
videoGetAll,videoInsertMany
};
