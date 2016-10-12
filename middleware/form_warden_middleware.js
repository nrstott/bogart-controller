var formWarden = require('form-warden');

module.exports = (validationOptions) => {
  return (req, locals, next) => {
    let result = formWarden.validateForm(req.params, validationOptions);
    if (!result.validForm) {
      return {
        status: 500,
        headers: {},
        body: ['Invalid Form!']
      };
    }

    return next();
  };
}