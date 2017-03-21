var formWarden = require('form-warden');
var serialize = require('serialize-javascript');

module.exports = (validationOptions) => {
  var str = serialize(validationOptions);

  return (req, locals, respond, views, _, next) => {
    function flatten(obj, notFirst) {
      var newObj = {};

      if (Array.isArray(obj)) {
        _.each(obj, (val, index) => {
          var result = flatten(val, true);
          _.forOwn(result, (v, k) => {
            newObj[notFirst ? '[' + index + ']' + k : index + k] = v;
          });
        });
      }else if (typeof(obj) === 'object') {
        _.forOwn(obj, (val, key) => {
          var result = flatten(val, true);
          _.forOwn(result, (v, k) => {
            newObj[notFirst ? '[' + key + ']' + k : key + k] = v;
          });
        });
      }else{
        newObj[''] = obj;
      }

      return newObj;
    }

    locals.validationOptions = req.validationOptions = str;

    var formObj = flatten(req.params);

    let result = formWarden.validateForm(formObj, validationOptions);
    if (!result.validForm) {
      var response = respond(views.formWardenError, { result: result });
      response.status = 500;
      return response;
    }

    return next();
  };
}