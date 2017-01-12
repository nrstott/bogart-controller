var _ = require('lodash');

module.exports = Controller => {

  class RouteController extends Controller {
    constructor(log) {
      super(log)
    }

    get get() { return {} }

    get post() { return {}; }

    get put() { return {}; }

    get delete() { return {}; }

    configRouter(router) {
      let register = (method, path, callback) => {
        this.log.trace('Registering route: '+method+' '+path);

        router.route(method, path, callback);
      };

      ['get','post','put','delete', 'head', 'options', 'trace', 'connect']
        .forEach(property => {
          _.toPairs(this[property])
            .map(pair => {
              var path = pair[0];
              var callback = pair[1];

              return [ property, path, callback ];
            })
            .forEach(args => {
              register.apply(this, args);
            });
        });
    }
  }

  return RouteController;
}
