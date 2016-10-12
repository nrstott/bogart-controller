var serialize = require('serialize-javascript');

module.exports = (validationOptions) => {
  var str = serialize(validationOptions);

  return (req, locals, next) => {
    locals.validationOptions = req.validationOptions = str;
    return next();
  };
}