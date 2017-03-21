var Injector = require('bogart-injector');
var formWardenMiddleware = require('../middleware/form_warden_middleware');
var injectionMiddleware = require('../middleware/form_warden_inject_middleware');

module.exports = Controller => {

  class ResourceController extends Controller {
    constructor(log) {
      super(log)
    }

    configRouter(router) {
      let register = (name, httpMethod, pattern, fn, validate) => {
        this.log.trace('Registering '+name+': '+httpMethod+' '+pattern);

        let routeCallback = fn => {
          return this.dependencies(fn).concat([ fn, this, {} ]);
        }

        if (this.validation) {
          if (validate) {
            router[httpMethod](pattern, formWardenMiddleware(this.validation), routeCallback(fn));
          }else{
            router[httpMethod](pattern, injectionMiddleware(this.validation), routeCallback(fn));
          }
        }else{
          router[httpMethod](pattern, routeCallback(fn));
        }
      }

      [
        [ 'list',    'get',  this.listUrl,    this.list ],
        [ 'list',    'post', this.listUrl,    this.action],
        [ 'show',    'get',  this.showUrl,    this.show ],
        [ 'create',  'post', this.createUrl,  this.create, true ],
        [ 'update',  'put',  this.updateUrl,  this.update, true ],
        [ 'update',  'post',  this.updateUrl,  this.update, true ],
        [ 'update',  'put',  this.editUrl,    this.update, true ],
        [ 'new',     'get',  this.newUrl,     this.new ],
        [ 'edit',    'get',  this.editUrl,    this.edit ],
        [ 'destroy', 'del',  this.destroyUrl, this.destroy ],
        [ 'bulk',    'post', this.bulkUrl,    this.bulk ],
        [ 'action',  'post', this.actionUrl,  this.action ]
      ].forEach(function (args) {
        var fn = args[3];

        if (!fn) { return; }

        register(args[0], args[1], args[2], args[3], args[4]);
      });
    }

    get validation() { return undefined; }

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
      return new RegExp('^/' + this.prefix + '/list(\/(.*?))?$');
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

    get actionUrl(){
      return '/'+this.prefix+'/action'
    }

    get bulkUrl(){
      return '/'+this.prefix+'/bulk'
    }
  }

  return ResourceController;
}
