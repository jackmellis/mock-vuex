import test from 'ava-spec';
import Sinon from 'sinon';
import mock from '../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();

  t.context = {sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test.group('getters', function (test) {
  test('it creates a store with getters', function (t) {
    let store = mock({
      getters : {
        getterA : () => 'A',
        getterB : () => 'B'
      }
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
              getters : {
                getterA : () => 'A',
                getterB : () => 'B'
              }
            }
          }
        }
      }
    });

    t.is(store.getters['moduleA/moduleB/getterA'], 'A');
    t.is(store.getters['moduleA/moduleB/getterB'], 'B');
  });
  test('it creates non namespaced getters with nested module paths', function (t) {
    let store = mock({
      modules : {
        moduleA : {
          modules : {
            moduleB : {
              namespaced : false,
              getters : {
                getterA : () => 'A',
                getterB : () => 'B'
              }
            }
          }
        }
      }
    });

    t.is(store.getters['getterA'], 'A');
    t.is(store.getters['getterB'], 'B');
  });
  test('getter has access to local state', function (t) {
    let store = mock({
      moduleA : {
        state : {
          foo : 'bah'
        },
        getters : {
          getterA(state){
            return state.foo;
          }
        }
      }
    });

    t.is(store.getters['moduleA/getterA'], 'bah');
  });
  test('getter has access to other local getters', function (t) {
    let store = mock({
      moduleA : {
        getters : {
          getterA : () => 'foo',
          getterB(state, getters){
            return getters.getterA;
          }
        }
      }
    });

    t.is(store.getters['moduleA/getterB'], 'foo');
  });
  test('getter has access to root state', function (t) {
    let store = mock({
      loading : true,
      moduleA : {
        getters : {
          isRootLoading(state, getters, rootState){
            return rootState.loading;
          }
        }
      }
    });

    t.is(store.getters['moduleA/isRootLoading'], true);
  });
  test('getter has access to root getters', function (t) {
    let store = mock({
      getters : {
        rootGetter(){
          return 'root';
        }
      },
      modules : {
        moduleA : {
          getters : {
            fromRootGetter(state, getters, rootState, rootGetters){
              return rootGetters['rootGetter'] + ' moduleA';
            }
          }
        },
        moduleB : {
          getters : {
            fromModuleAGetter(state, getters, rootState, rootGetters){
              return rootGetters['moduleA/fromRootGetter'] + ' moduleB';
            }
          }
        }
      }
    });

    t.is(store.getters['moduleB/fromModuleAGetter'], 'root moduleA moduleB');
  });
});
