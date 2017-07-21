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

test.group('state-only', function (test) {
  test('it creates a store with root state', function (t) {
    let store = mock({
      loading : true,
      foo : 'bah'
    });

    t.not(store.state, undefined);
    t.is(store.state.loading, true);
    t.is(store.state.foo, 'bah');
  });
  test('it creates nested modules', function (t) {
    let store = mock({
      moduleA : {
        value : 'A'
      },
      moduleB : {
        value : 'B',
        moduleC : {
          value : 'C'
        }
      }
    });

    t.is(store.state.moduleA.value, 'A');
    t.is(store.state.moduleB.value, 'B');
    t.is(store.state.moduleB.moduleC.value, 'C');
  });

  test('it allows a mixed configuration', function (t) {
    let store = mock({
      simple : {
        loading : true,
        foo : 'bah'
      },
      complex : {
        state : {
          loading : false,
          foo : 'bah'
        },
        getters : {
          getMe : () => 'got!'
        }
      }
    });

    t.is(store.state.simple.loading, true);
    t.is(store.state.simple.foo, 'bah');
    t.is(store.state.complex.loading, false);
    t.is(store.state.complex.foo, 'bah');
    t.is(store.getters['complex/getMe'], 'got!');
  });
});

test.group('state', function (test) {
  test('it creates a store with root state', function (t) {
    let store = mock({
      state : {
        loading : true
      }
    });

    t.is(store.state.loading, true);
  });
  test('it creats a store with nested states', function (t) {
    let store = mock({
      modules : {
        foo : {
          state : {
            loading : false
          }
        }
      }
    });

    t.is(store.state.foo.loading, false);
  });
});
