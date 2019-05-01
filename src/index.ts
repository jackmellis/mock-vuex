import Store from './Store';
import {
  Config,
} from './types';

export default (config: Config = {}) => {
  return new Store(config);
};
