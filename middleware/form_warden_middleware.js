var formWarden = require('form-warden');
var serialize = require('serialize-javascript');

module.exports = (validationOptions) => {
  var str = serialize(validationOptions);

  return (req, locals, respond, views, _, next) => {
    locals.validationOptions = req.validationOptions = str;

    let result = formWarden.validateForm(req.params, validationOptions);
    if (!result.validForm) {
      var response = respond(views.formWardenError, { result: result });
      response.status = 500;
      return response;
    }

    return next();
  };
}