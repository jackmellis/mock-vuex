import {
  Module,
} from 'vuex';

export type Config = Module<any, any> | {
  [key: string]: Config | any,
};

export type ModuleNamespace = {
  context: {
    getters: any,
    state: any,
    commit: any,
    dispatch: any,
  },
};

export type ModuleNamespaceMap = {
  [key: string]: ModuleNamespace,
};

export interface PayloadWithType {
  type: string,
  [key: string]: any,
}

export type NameOrPayload = string | PayloadWithType;

export interface When {
  method: string | RegExp | null,
  name: string | RegExp | null,
  count: number,
  otherwise: boolean,
  expected?: number,
  callback: (context: null, payload: null) => any,
}

export interface Result {
  return(value: any): Result,
  call(cb: (...args: any[]) => any): Result,
  stop(): Result,
  throw(value?: any): Result,
  reject(value?: any): Result,
}
