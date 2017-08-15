var globalConfig = require('.');

function create(config, store, state, path) {
  if (!config.state && !config.getters && !config.mutations && !config.actions && !config.modules && config.namespaced === undefined){
    config = {
      state : config,
      modules : {}
    };
    Object.keys(config.state).forEach(function (key) {
      var v = config.state[key];
      if (Object.prototype.toString.call(v) === '[object Object]'){
        config.modules[key] = v;
      }
    });
  }
  if (config.namespaced === undefined){
    config.namespaced = globalConfig.config.autoNamespace;
  }
  if (!config.state){
    config.state = {};
  }
  if (!config.getters){
    config.getters = {};
  }
  if (!config.mutations){
    config.mutations = {};
  }
  if (!config.actions){
    config.actions = {};
  }
  if (!config.modules){
    config.modules = {};
  }

  createState(store, store._modulesNamespaceMap, state, config.state, path);

  createGetters(store, store._modulesNamespaceMap, state, store.getters, config.getters, path, config.namespaced);
  createCommits(store, store._modulesNamespaceMap, state, config.mutations, path, config.namespaced);
  createActions(store, store._modulesNamespaceMap, state, config.actions, path, config.namespaced);

  createModules(store, store._modulesNamespaceMap, state, config.modules, path, config.namespaced);

  return store;
}

function createModules(store, modules, state, config, path, namespaced) {
  Object.keys(config).forEach(function (key) {
    var module = config[key];
    var moduleKey = path.concat(key, '').join('/');

    var localState = {};
    state[key] = localState;

    modules[moduleKey] = modules[moduleKey] || generateModuleNamespace();
    modules[moduleKey].context.state = localState;

    create(module, store, localState, path.concat(key), namespaced);
  });
}

function generateModuleNamespace() {
  return {
    context : {
      getters : {},
      state : {}
    }
  };
}

function createState(store, modules, state, config) {
  Object.keys(config).forEach(function (key) {
    var value = config[key];
    state[key] = value;
  });
}

function createGetters(store, modules, state, getters, config, path, namespaced) {
  var localGetters = {};
  if (!namespaced){
    path = [];
  }

  Object.keys(config).forEach(function (key) {
    var value = config[key];

    var getterKey = path.concat(key).join('/');
    var moduleKey = path.concat('').join('/');

    modules[moduleKey] = modules[moduleKey] || generateModuleNamespace();

    var property = {
      enumerable : true,
      get : function () {
        return value(state, localGetters, store.state, store.getters);
      }
    };

    Object.defineProperty(localGetters, key, property);
    Object.defineProperty(modules[moduleKey].context.getters, key, property);
    Object.defineProperty(getters, getterKey, property);
  });
}

function createCommits(store, modules, state, config, path, namespaced){
  if (!namespaced){
    path = [];
  }

  Object.keys(config).forEach(function (key) {
    var value = config[key];
    var getterKey = path.concat(key).join('/');
    if (typeof value !== 'function'){
      store.when('commit', getterKey).return(value);
    }else{
      store.when('commit', getterKey).call(value);
    }
  });
}

function createActions(store, modules, state, config, path, namespaced){
  if (!namespaced){
    path = [];
  }

  Object.keys(config).forEach(function (key) {
    var value = config[key];
    var getterKey = path.concat(key).join('/');
    if (typeof value !== 'function'){
      store.when('dispatch', getterKey).return(value);
    }else{
      store.when('dispatch', getterKey).call(value);
    }
  });
}

module.exports = create;
