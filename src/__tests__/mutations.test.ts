import test from 'ava';
import sinon from 'sinon';
import mock from '..';

test('calls the mutation method', function (t) {
  let spy = sinon.spy();

  let store = mock({
    mutations : {
      TEST : spy,
    },
  });

  store.commit('TEST');

  t.true(spy.called);
});
test('calls a nested mutation method', function (t) {
  let spy = sinon.spy();

  let store = mock({
    moduleA : {
      namespaced: true,
      mutations : {
        TEST : spy,
      },
    },
  });

  store.commit('TEST');
  t.false(spy.called);

  store.commit('moduleA/TEST');
  t.true(spy.called);
});
test('calls a non namespaced nested mutation method', function (t) {
  let spy = sinon.spy();

  let store = mock({
    moduleA : {
      namespaced : false,
      mutations : {
        TEST : spy,
      },
    },
  });

  store.commit('TEST');
  t.true(spy.called);
});
test('has access to the local state', function (t) {
  return new Promise(resolve => {
    let store = mock({
      moduleA : {
        namespaced: true,
        state : {
          loading : true,
        },
        mutations : {
          TEST(state: any){
            t.is(state.loading, true);
            resolve();
          },
        },
      },
    });

    store.commit('moduleA/TEST');
  });
});
test('non-namespaced has access to the local state', function (t) {
  return new Promise(resolve => {
    let store = mock({
      moduleA : {
        namespaced: false,
        state : {
          loading : true,
        },
        mutations : {
          TEST(state: any){
            t.is(state.loading, true);
            resolve();
          },
        },
      },
    });

    store.commit('TEST');
  });
});
test('has access to the payload', function (t) {
  return new Promise(resolve => {
    let store = mock({
      moduleA : {
        namespaced: true,
        mutations : {
          TEST(state: any, payload: any){
            t.is(payload, 'foo');
            resolve();
          },
        },
      },
    });

    store.commit('moduleA/TEST', 'foo');
  });
});
