var Injector = require('bogart-injector');

module.exports = Controller => {

  class ResourceController extends Controller {
    constructor(log) {
      super(log)
    }

    configRouter(router) {
      let register = (name, httpMethod, pattern, fn) => {
        console.log(this.dependencies(fn));
        this.log.info('Registering '+name+': '+httpMethod+' '+pattern);

        let routeCallback = fn => {
          return this.dependencies(fn).concat([ fn, this, {} ]);
        }

        router[httpMethod](pattern, routeCallback(fn));
      }

      [
        [ 'list',    'get',  this.listUrl,    this.list ],
        [ 'show',    'get',  this.showUrl,    this.show ],
        [ 'create',  'post', this.createUrl,  this.create ],
        [ 'update',  'put',  this.updateUrl,  this.update ],
        [ 'new',     'get',  this.newUrl,     this.new ],
        [ 'edit',    'get',  this.editUrl,    this.edit ],
        [ 'destroy', 'del',  this.destroyUrl, this.destroy ]
      ].forEach(function (args) {
        var fn = args[3];

        if (!fn) { return; }

        register(args[0], args[1], args[2], args[3]);
      });
    }

    list(views, respond) {
      log.debug('Rendering '+views[self.prefix].index);
      return respond(views[self.prefix].index);
    }

    dependencies(fn) {
      return Injector.annotate(fn);
    }

    get newUrl() {
      return '/'+this.prefix;
    }

    get createUrl() {
      return '/'+this.prefix;
    }

    get editUrl() {
      return '/'+this.prefix+'/:id/edit';
    }

    get listUrl() {
      return '/' + (this.prefixPlural ? this.prefixPlural : (this.prefix +'s'));
    }

    get showUrl() {
      return '/'+this.prefix+'/:id';
    }

    get updateUrl() {
      return '/'+this.prefix+'/:id';
    }

    get destroyUrl() {
      return '/'+this.prefix+'/:id';
    }
  }

  return ResourceController;
}