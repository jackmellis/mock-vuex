import test from 'ava';
import mock from '..';

test('it creates a store with root state', function (t) {
  let store = mock({
    loading : true,
    foo : 'bah',
  });

  t.not(store.state, undefined);
  t.is(store.state.loading, true);
  t.is(store.state.foo, 'bah');
});
test('it creates nested modules', function (t) {
  let store = mock({
    moduleA : {
      value : 'A',
    },
    moduleB : {
      value : 'B',
      moduleC : {
        value : 'C',
      },
    },
  });

  t.is(store.state.moduleA.value, 'A');
  t.is(store.state.moduleB.value, 'B');
  t.is(store.state.moduleB.moduleC.value, 'C');
});
