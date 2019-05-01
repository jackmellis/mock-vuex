import test from 'ava';
import mock from '..';

test('it creates a store with getters', function (t) {
  let store = mock({
    getters : {
      getterA : () => 'A',
      getterB : () => 'B',
    },
  });

  t.is(store.getters.getterA, 'A');
  t.is(store.getters.getterB, 'B');
});
test('it creates getters with nested module paths', function (t) {
  let store = mock({
    modules : {
      moduleA : {
        modules : {
          moduleB : {
            namespaced: true,
            getters : {
              getterA : () => 'A',
              getterB : () => 'B',
            },
          },
        },
      },
    },
  });

  t.is(store.getters['moduleA/moduleB/getterA'], 'A');
  t.is(store.getters['moduleA/moduleB/getterB'], 'B');
});
test('it creates non namespaced getters with nested module paths', (t) => {
  let store = mock({
    modules : {
      moduleA : {
        modules : {
          moduleB : {
            namespaced : false,
            getters : {
              getterA : () => 'A',
              getterB : () => 'B',
            },
          },
        },
      },
    },
  });

  t.is(store.getters['getterA'], 'A');
  t.is(store.getters['getterB'], 'B');
});
test('getter has access to local state', function (t) {
  let store = mock({
    moduleA : {
      namespaced: true,
      state : {
        foo : 'bah',
      },
      getters : {
        getterA(state: any){
          return state.foo;
        },
      },
    },
  });

  t.is(store.getters['moduleA/getterA'], 'bah');
});
test('getter has access to other local getters', function (t) {
  let store = mock({
    moduleA : {
      namespaced: true,
      getters : {
        getterA : () => 'foo',
        getterB(state: any, getters: any){
          return getters.getterA;
        },
      },
    },
  });

  t.is(store.getters['moduleA/getterB'], 'foo');
});
test('getter has access to root state', function (t) {
  let store = mock({
    loading : true,
    moduleA : {
      namespaced: true,
      getters : {
        isRootLoading(state: any, getters: any, rootState: any){
          return rootState.loading;
        },
      },
    },
  });

  t.is(store.getters['moduleA/isRootLoading'], true);
});
test('getter has access to root getters', function (t) {
  let store = mock({
    getters : {
      rootGetter(){
        return 'root';
      },
    },
    modules : {
      moduleA : {
        namespaced: true,
        getters : {
          fromRootGetter(state, getters, rootState, rootGetters){
            return rootGetters['rootGetter'] + ' moduleA';
          },
        },
      },
      moduleB : {
        namespaced: false,
        getters : {
          fromModuleAGetter(state, getters, rootState, rootGetters){
            return rootGetters['moduleA/fromRootGetter'] + ' moduleB';
          },
        },
      },
      moduleC: {
        namespaced: true,
        getters: {
          fromModuleBGetter(state, getters, rootState, rootGetters){
            return rootGetters.fromModuleAGetter + ' moduleC';
          },
        },
      },
    },
  });

  t.is(
    store.getters['moduleC/fromModuleBGetter'],
    'root moduleA moduleB moduleC'
  );
});
