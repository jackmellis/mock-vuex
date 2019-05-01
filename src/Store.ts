/* eslint-disable no-dupe-class-members */
import { Module, Store as VuexStore } from 'vuex';
import Vue from 'vue';
import {
  ModuleNamespaceMap,
  ModuleNamespace,
  Config,
  PayloadWithType,
  Result,
  When,
} from './types';
import {
  normalizeModule,
  normalizePayload,
  createModuleNamespace,
  last,
} from './utils';
import reactify from './reactify';

class Store implements VuexStore<any> {
  state: any = reactify({});
  getters: any = {};
  _modulesNamespaceMap: ModuleNamespaceMap = {};
  $$modules: Module<any, any>;

  $$when: When[] = [];
  $$assertions: When[] = [];

  constructor(config: Config) {
    this.registerModule([], config);
  }

  get $$isStore() {
    return true;
  }

  registerModule(path: string, config: Config): void
  registerModule(path: string[], config: Config): void
  registerModule(p: string | string[], config: Config) {
    let path: string[];
    if (typeof p === 'string') {
      path = p.split('/');
    } else {
      path = p;
    }

    // module
    const moduleName = last(path);
    const pathToModule = path.slice(0, -1);
    const parentModule = pathToModule.reduce((module, key) => {
      if (module.modules[key] == null) {
        // eslint-disable-next-line no-param-reassign
        module.modules[key] = normalizeModule({});
      }
      return module.modules[key];
    }, this.$$modules);

    let module: Module<any, any>;
    let m: ModuleNamespace;
    let state: any;

    if (moduleName != null) {
      module = parentModule.modules[moduleName] = normalizeModule(config);
      const namespaceKey = (module.namespaced ? path : []).join('/') + '/';
      // eslint-disable-next-line max-len
      m = this._modulesNamespaceMap[namespaceKey] = this._modulesNamespaceMap[namespaceKey] || createModuleNamespace();
      const parentState = pathToModule.reduce((state, key) => {
        if (state[key] == null) {
          Vue.set(state, key, {});
        }
        return state[key];
      }, this.state);

      Vue.set(parentState, moduleName, module.state);
      state = parentState[moduleName];
      m.context.state = state;
    } else {
      module = this.$$modules = normalizeModule(config);
      m = this._modulesNamespaceMap['/'] = createModuleNamespace();
      state = this.state = reactify(module.state);
      m.context.state = state;
    }

    const localGetters: any = {};
    Object.keys(module.getters).forEach((key) => {
      const getter = module.getters[key];
      const prefix = (module.namespaced ? path : []);
      const getterKey = prefix.concat(key).join('/');
      
      const property = {
        enumerable: true,
        get: () => getter(
          state,
          localGetters,
          this.state,
          this.getters,
        ),
      };

      Object.defineProperty(localGetters, key, property);
      Object.defineProperty(m.context.getters, key, property);
      Object.defineProperty(this.getters, getterKey, property);
    });

    Object.keys(module.mutations).forEach((key) => {
      let mutation = module.mutations[key];
      const getterKey = path.concat(key).join('/');
      if (typeof mutation === 'function') {
        const fn = mutation;
        mutation = (state, payload) => fn(m.context.state, payload);
        this.when('commit', getterKey).call(mutation);
        if (!module.namespaced) {
          this.when('commit', key).call(mutation);
        }
      } else {
        this.when('commit', getterKey).return(mutation);
        if (!module.namespaced) {
          this.when('commit', key).return(mutation);
        }
      }
      m.context.commit = (name: string, payload: any) => {
        return this.commit(path.concat(name).join('/'), payload);
      };
    });

    Object.keys(module.actions).forEach((key) => {
      let action = module.actions[key];

      if (typeof action === 'function') {
        const fn = action;
        action = (context, payload) => fn.call(this, {
          ...context,
          state: m.context.state,
          getters: m.context.getters,
        }, payload);
        this.when('dispatch', path.concat(key).join('/')).call(action);
        if (!module.namespaced) {
          this.when('dispatch', key).call(action);
        }
      } else {
        this.when('dispatch', path.concat(key).join('/')).return(action);
        if (!module.namespaced) {
          this.when('dispatch', key).return(action);
        }
      }
      m.context.dispatch = (name: string, payload: any) => {
        return this.dispatch(path.concat(name).join('/'), payload);
      };
    });

    Object.keys(module.modules).forEach((key) => {
      this.registerModule(path.concat(key), module.modules[key]);
    });
  }

  unregisterModule(path: string): void
  unregisterModule(path: string[]): void
  unregisterModule(p: string | string[]) {
    let path: string[];
    if (typeof p === 'string') {
      path = p.split('/');
    } else {
      path = p;
    }

    const name = last(path);
    path = path.slice(0, -1);
    const moduleKey = path.concat('').join('/');

    let state = this.state;
    path.forEach((key) => {
      state = state && state[key];
    });

    if (this._modulesNamespaceMap[moduleKey]) {
      delete this._modulesNamespaceMap[moduleKey];
    }
    if (state && state[name]) {
      Vue.delete(state, name);
    }
  }

  replaceState(state: object) {
    this.state = reactify(state);
  }
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  watch(
    fn: (state: any, getters: any) => any,
    cb: (value: any, oldValue: any) => void,
    options?: any,
  ) {
    return () => {};
  }
  subscribe(handler: (mutation: any, state: any) => void) {
    return () => {};
  }
  subscribeAction(handler: (action: any, state: any) => void) {
    return () => {};
  }
  hotUpdate(options: any) {}
  /* eslint-enable no-unused-vars */
  /* eslint-enable @typescript-eslint/no-unused-vars */
  commit(name: string): any
  commit(name: string, payload: any): any
  commit(payload: PayloadWithType): any
  commit(n: any, p?: any) {
    const {
      name,
      payload,
    } = normalizePayload(n, p);
    const pathToCommit = name.split('/').slice(0, -1);
    const state = pathToCommit.reduce((last, current) => {
      return last && last[current];
    }, this.state);
    return this.$$doWhen('commit', name, state, payload);
  }

  dispatch(name: string): Promise<any>
  dispatch(name: string, payload: any): Promise<any>
  dispatch(payload: PayloadWithType): Promise<any>
  dispatch(n: any, p?: any) {
    const {
      name,
      payload,
    } = normalizePayload(n, p);
    const pathToAction = name.split('/').slice(0, -1);

    const state = pathToAction.reduce((last, current) => {
      return last && last[current];
    }, this.state);
    const rootState = this.state;
    const commit = (n: any, p?: any) => {
      const {
        name,
        payload,
      } = normalizePayload(n, p);
      const commitName = pathToAction.concat(name).join('/');
      return this.commit(commitName, payload);
    };
    const dispatch = (n: any, p?: any) => {
      const {
        name,
        payload,
      } = normalizePayload(n, p);
      const dispatchName = pathToAction.concat(name).join('/');
      return this.dispatch(dispatchName, payload);
    };
    const getters = this.getters;

    const context = {
      state,
      rootState,
      commit,
      dispatch,
      getters,
    };

    try {
      return Promise.resolve(this.$$doWhen('dispatch', name, context, payload));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  when(
    method?: string | RegExp,
    name?: string | RegExp,
  ) {
    const matchAny = /.*/;
    /* eslint-disable no-param-reassign */
    if (method === undefined && name === undefined) {
      method = name = matchAny;
    } else if (method === undefined) {
      method = matchAny;
    } else if (name === undefined) {
      name = method;
      method = matchAny;
    }
    /* eslint-enable no-param-reassign */

    if (typeof method === 'string') {
      // eslint-disable-next-line no-param-reassign
      method = method.toLowerCase();
    }

    const when: When = {
      method,
      name,
      count: 0,
      otherwise: false,
      callback: (context, payload) => payload,
    };

    this.$$when.push(when);

    const result: Result = {
      return(value) {
        when.callback = () => value;
        return this;
      },
      call(cb) {
        when.callback = cb;
        return this;
      },
      stop() {
        when.callback = () => new Promise<any>(() => {});
        return this;
      },
      throw(value) {
        return this.reject(value);
      },
      reject(value) {
        when.callback = () => {
          throw (value || new Error);
        };
        return this;
      },
    };
    return result;
  }

  otherwise() {
    this.$$when.reverse();
    const result = this.when();
    this.$$when.reverse();
    this.$$when[0].otherwise = true;
    return result;
  }

  expect(): Result
  expect(count: number): Result
  expect(method: string | RegExp): Result
  expect(method: string | RegExp, count: number): Result
  expect(method: string | RegExp, name: string | RegExp): Result
  expect(method: string | RegExp, name: string | RegExp, count: number): Result
  expect(
    m?: string | RegExp | number,
    n?: string | RegExp | number,
    c?: number,
  ) {
    let method: string | RegExp;
    let name: string | RegExp;
    let count: number;

    if (typeof m === 'number') {
      method = undefined;
      name = undefined;
      count = m;
    } else if (typeof n === 'number') {
      method = m;
      name = undefined;
      count = n;
    } else {
      method = m;
      name = n;
      count = c;
    }

    const result = this.when(method, name);
    const when = last(this.$$when);
    when.expected = count;
    this.$$assertions.push(when);
    return result;
  }

  assert() {
    const assertions = this.$$assertions.splice(0);
    assertions.forEach((assertion) => {
      const a = JSON.stringify({
        method: assertion.method,
        name: assertion.name,
      });
      if (typeof assertion.expected === 'number') {
        if (assertion.expected !== assertion.count) {
          throw new Error(`Expected ${a} to have been called ${assertion.expected} times but was called ${assertion.count} times`);
        }
      } else if (assertion.count < 1) {
        throw new Error(`Expected a call for ${a}`);
      }
    });
  }

  $$doWhen(
    method: string,
    name: string,
    ...args: any[]
  ) {
    // eslint-disable-next-line no-param-reassign
    method = method.toLowerCase();
    const lastArg = last(args);
    const requests = this.$$when
      .slice()
      .reverse()
      .filter((when) => {
        if (when.method instanceof RegExp) {
          if (!when.method.test(method)) {
            return false;
          }
        } else if (when.method !== method) {
          return false;
        }

        if (when.name instanceof RegExp) {
          if (!when.name.test(name)) {
            return false;
          }
        } else if (when.name !== name) {
          return false;
        }

        return true;
      })
      .filter((when, i, arr) => {
        if (i === 0) {
          return true;
        } else if (arr.length > 1 && when.otherwise) {
          return false;
        } else {
          return true;
        }
      });

    return requests.reduce((x, when) => {
      // eslint-disable-next-line no-param-reassign
      when.count++;
      if (when.callback) {
        return when.callback.apply(this, args);
      } else {
        return x;
      }
    }, lastArg);
  }
}

export default Store;
