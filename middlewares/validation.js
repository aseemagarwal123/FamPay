const createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
async function validateCalculate(req, res, next) {
  try {
    for (const param of ['distance_travelled', 'travel_time', 'rate_per_km','waiting_time']) {
      if (!(param in req.body) || typeof req.body[param] != 'number' || req.body[param] < 0) {
        console.log(req.body);
        return next(createError(406, `Incorrect or Missing ${param} in the request`));
      }
    }
    for (const param of ['ride_cancel_after', 'ride_cancel_before']) {
      if (!(param in req.body) || typeof req.body[param] != 'boolean') {
        console.log(req.body);
        return next(createError(406, `Incorrect or Missing ${param} in the request`));
      }
    }
    if (!req.body.surge || !['low','medium','high'].includes(req.body.surge)) {
      console.log(req.body);
      return next(createError(406, `Incorrect or Missing surge in the request`));
    }
    if (req.body.ride_cancel_after && req.body.ride_cancel_before) {
      console.log(req.body);
      return next(createError(406, 'ride_cancel_after and ride_cancel_before cannot be True at same time'));
    }
    return next();
  } catch (ex) {
    next(ex)
  }
}

async function validateAssign(req, res, next) {
  try {
    if (!['gold','platinum','silver'].includes(req.query.type)) {
      console.log(req.body);
      return next(createError(406, `Incorrect or Missing type in the request`));
    }
    return next();
  } catch (ex) {
    next(ex)
  }
}


async function validateRating(req, res, next) {
  try {
    //
    for (const param of ['rating']) {
      if (!(param in req.body) || typeof req.body[param] != 'number' || req.body[param] < 1 || req.body[param] > 5) {
        console.log(req.body);
        return next(createError(406, `Incorrect or Missing rating in the request`));
      }
    }
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(406, `Incorrect or Missing id in the request`));
    }
    return next();
  } catch (ex) {
    next(ex)
  }
}

module.exports = {
  validateCalculate,
  validateAssign,
  validateRating
};
