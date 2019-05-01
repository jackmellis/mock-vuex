import { Module } from 'vuex';
import { Config, ModuleNamespace } from './types';

// eslint-disable-next-line max-len
export const isObject = (obj: any) => Object.prototype.toString.call(obj) === '[object Object]';

export const last = <T>(arr: T[]) => arr[arr.length - 1];

export const normalizeModule = (config: Config) => {
  const result: Module<any, any> = {
    namespaced: false,
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {},
  };

  if (
    !config.state &&
    !config.getters &&
    !config.mutations &&
    !config.actions &&
    !config.modules &&
    config.namespaced == null
  ) {
    result.namespaced = true;
    Object.keys(config).forEach((key) => {
      // @ts-ignore
      const state = config[key];
      if (isObject(state)) {
        result.modules[key] = state;
      } else {
        result.state[key] = state;
      }
    });
  } else {
    Object.assign(result, config);
  }

  Object.keys(result.modules).forEach((key) => {
    result.modules[key] = normalizeModule(result.modules[key]);
  });

  return result;
};

export const normalizePayload = (
  name: any,
  payload: any,
): {
  name: string,
  payload: any,
} => {
  if (typeof name === 'object') {
    return {
      name: name.type,
      payload: name,
    };
  }
  return {
    name,
    payload,
  };
};

export const createModuleNamespace = (): ModuleNamespace => ({
  context: {
    getters: {},
    state: {},
    commit: {},
    dispatch: {},
  },
});
