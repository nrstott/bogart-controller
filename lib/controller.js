var _ = require('lodash');

module.exports = bogart => class Controller {
  constructor(log) {
    log = log || {
      info: console.log.bind(console),
      debug: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console)
    };

    this.log = log;

    Object.keys(_.omit(bogart, 'router')).forEach((property) => {
      this[property] = bogart[property];
    });
  }

  get isController() { return true; }

  get before() {
    return [];
  }

  get prefix() {
    throw new Error('Implementor of Controller must override prefix');
  }

  get after() {
    return [];
  }

  configRouter(router) {
    // Subclasses override to customize router
  }

  get router() {
    var self = this;
    var log = this.log;
    var router = bogart.router();

    if (this.before.length) {
      this.before.forEach(router.before);
    } else if (this.before && !Array.isArray(this.before)) {
      router.before(this.before);
    }

    if (this.after.length) {
      this.after.forEach(router.after);
    } else if (this.after && !Array.isArray(this.after)) {
      router.after(this.after);
    }

    this.configRouter(router);

    return router;
  }

  static get ResourceController() {
    return require('./resource_controller')(Controller);
  }

  static get RouteController() {
    return require('./route_controller')(Controller);
  }
}
