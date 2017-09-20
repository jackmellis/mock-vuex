import test from 'ava-spec';
import mock from '../src';

test.group('registerModule', test => {
  test('registers a module', t => {
    const store = mock();
    store.registerModule('test', {
      state: {
        foo: 'bah',
      },
    });

    t.is(store.state.test.foo, 'bah');
  });
  test('registers a nested module', t => {
    const store = mock();
    store.registerModule(['test', 'x'], {
      state: {
        foo: 'bah',
      },
    });

    t.is(store.state.test.x.foo, 'bah');
  });
});

test.group('unregisterModule', test => {
  test('unregisters a module', t => {
    const store = mock({
      modules: {
        test: {
          foo: 'bah'
        }
      },
    });

    t.is(store.state.test.foo, 'bah');

    store.unregisterModule('test');

    t.is(store.state.test, undefined);
  });
});
