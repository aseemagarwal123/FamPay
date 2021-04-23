const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');


var videoSchema = new mongoose.Schema({
  title:{
    type: String,
  },
  description:{
    type: String,
  },
  published_datetime:{
    type: Date,
  },
  thumbnails:{
    type: Object
  }
});

videoSchema.plugin(timestamps);
videoSchema.index({'$**': 'text'});
const video = mongoose.model('video', videoSchema);
exports.video = video;