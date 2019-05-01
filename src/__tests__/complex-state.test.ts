import test from 'ava';
import mock from '..';

test('it allows a mixed configuration', function (t) {
  let store = mock({
    simple : {
      loading : true,
      foo : 'bah',
    },
    complex : {
      namespaced: true,
      state : {
        loading : false,
        foo : 'bah',
      },
      getters : {
        getMe : () => 'got!',
      },
    },
  });

  t.is(store.state.simple.loading, true);
  t.is(store.state.simple.foo, 'bah');
  t.is(store.state.complex.loading, false);
  t.is(store.state.complex.foo, 'bah');
  t.is(store.getters['complex/getMe'], 'got!');
});

test('it creates a store with root state', function (t) {
  let store = mock({
    state : {
      loading : true,
    },
  });

  t.is(store.state.loading, true);
});
test('it creates a store with nested states', function (t) {
  let store = mock({
    modules : {
      foo : {
        state : {
          loading : false,
        },
      },
    },
  });

  t.is(store.state.foo.loading, false);
});
