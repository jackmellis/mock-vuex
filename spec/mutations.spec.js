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

test.group('mutations', function (test) {
  test('calls the mutation method', function (t) {
    let spy = t.context.sinon.spy();

    let store = mock({
      mutations : {
        TEST : spy
      }
    });

    store.commit('TEST');

    t.true(spy.called);
  });
  test('calls a nested mutation method', function (t) {
    let spy = t.context.sinon.spy();

    let store = mock({
      moduleA : {
        mutations : {
          TEST : spy
        }
      }
    });

    store.commit('TEST');
    t.false(spy.called);

    store.commit('moduleA/TEST');
    t.true(spy.called);
  });
  test('has access to the local state', function (t) {
    return new Promise(resolve => {
      let store = mock({
        moduleA : {
          state : {
            loading : true
          },
          mutations : {
            TEST(state){
              t.is(state.loading, true);
              resolve();
            }
          }
        }
      });

      store.commit('moduleA/TEST');
    });
  });
  test('has access to the payload', function (t) {
    return new Promise(resolve => {
      let store = mock({
        moduleA : {
          mutations : {
            TEST(state, payload){
              t.is(payload, 'foo');
              resolve();
            }
          }
        }
      });

      store.commit('moduleA/TEST', 'foo');
    });
  });
});
