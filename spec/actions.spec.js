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

test.group('actions', function (test) {
  test('calls the action method', function (t) {
    let {sinon} = t.context;

    let spy = sinon.spy();
    let store = mock({
      actions : {
        test : spy
      }
    });

    return store.dispatch('test')
      .then(() => {
        t.true(spy.called);
      });
  });
  test('accepts an action object', function (t) {
    let {sinon} = t.context;

    let spy = sinon.spy();
    let store = mock({
      actions : {
        test : spy
      }
    });

    return store.dispatch({ type: 'test' })
      .then(() => {
        t.true(spy.called);
      });
  });
  test('calls a nested action method', function (t) {
    let {sinon} = t.context;
    let spy = sinon.spy();

    let store = mock({
      moduleA : {
        moduleB : {
          actions : {
            test : spy
          }
        }
      }
    });

    return store.dispatch('moduleA/moduleB/test').then(() => {
      t.true(spy.called);
    });
  });
  test('calls a non-namespaced method', async function (t) {
    let {sinon} = t.context;
    let spy1 = sinon.spy();
    let spy2 = sinon.spy();
    let spy3 = sinon.spy();

    let store = mock({
      rootModule: {
        modules: {
          moduleA : {
            namespaced : false,
            actions : {
              test : spy1
            }
          },
          moduleB : {
            namespaced: false,
            actions: {
              test: spy2
            }
          },
          moduleC : {
            namespaced: true,
            actions: {
              test: spy3
            }
          }
        }
      }
    });

    await store.dispatch('test');
    t.true(spy1.called);
    t.true(spy2.called);
    t.false(spy3.called);

    await store.dispatch('rootModule/moduleC/test');
    t.true(spy3.called);
  });
  test.serial('turns off namespacing by default', async function (t) {
    let {sinon} = t.context;
    let spy = sinon.spy();

    mock.config.autoNamespace = false;
    let store = mock({
      moduleA : {
        moduleB : {
          actions : {
            test : spy
          }
        }
      }
    });

    await store.dispatch('moduleA/moduleB/test');
    t.false(spy.called);
    await store.dispatch('test');
    t.true(spy.called);
    mock.config.autoNamespace = true;
  });
  test('always returns a promise', function (t) {
    let store = mock();

    return store.dispatch('some/unknown/event').then(() => {
      t.pass();
    });
  });
  test('has access to local state', function (t) {
    let store = mock({
      moduleA : {
        state : {
          loading : true
        },
        actions : {
          test({state}){
            return state.loading;
          }
        }
      }
    });

    return store.dispatch('moduleA/test').then(result => {
      t.is(result, true);
    });
  });
  test('has access to root state', function (t) {
    let store = mock({
      loading : true,
      moduleA : {
        state : {
          loading : false
        },
        actions : {
          test({rootState}){
            return rootState.loading;
          }
        }
      }
    });

    return store.dispatch('moduleA/test').then(result => {
      t.is(result, true);
    });
  });
  test('has access to local dispatch', function (t) {
    let store = mock({
      moduleA : {
        actions : {
          test({dispatch}){
            return dispatch('test2').then(response => response);
          },
          test2(){
            return 'success';
          }
        }
      }
    });

    return store.dispatch('moduleA/test').then(result => {
      t.is(result, 'success');
    });
  });
  test('has access to local commit', function (t) {
    let {sinon} = t.context;
    let spy = sinon.spy();

    let store = mock({
      moduleA : {
        mutations : {
          TEST : spy
        },
        actions : {
          test({commit}){
            commit('TEST');
          }
        }
      }
    });

    return store.dispatch('moduleA/test').then(() => {
      t.true(spy.called);
    });
  });
  test('has access to the payload', function (t) {
    let store = mock({
      actions : {
        test(context, payload){
          return payload;
        }
      }
    });

    return store.dispatch('test', 'fred').then(result => {
      t.is(result, 'fred');
    });
  });

  test('can have the same name as a mutation', function (t) {
    let {sinon} = t.context;
    let mutationSpy = sinon.spy();
    let actionSpy = sinon.spy();

    let store = mock({
      mutations : {
        thing : mutationSpy
      },
      actions : {
        thing : actionSpy
      }
    });

    store.commit('thing');
    return store.dispatch('thing').then(() => {
      t.true(mutationSpy.called);
      t.true(actionSpy.called);
    });
  });
});
