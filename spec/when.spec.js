import test from 'ava-spec';
import Sinon from 'sinon';
import jpex from 'jpex';
import jpexDefaults from 'jpex-defaults';
import mock from '../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();

  t.context = {sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test.group('when', function (test) {
  function setup(t) {
    let store = mock({
      moduleA : {
        count : 0
      }
    });

    t.context.store = store;

    return t.context;
  }

  test('triggers the response when the related method is used', function (t) {
    let {store, sinon} = setup(t);
    let spy = sinon.spy();
    let spy2 = sinon.spy();
    store.when('dispatch').call(spy);
    store.when('COMMIT').call(spy2);

    t.false(spy.called);
    t.false(spy2.called);

    store.commit('COMMIT');
    t.false(spy.called);
    t.true(spy2.called);

    return store.dispatch('dispatch').then(() => {
      t.true(spy.called);
    });
  });
  test('does not trigger if the incorrect method is used', async function (t) {
    let {store, sinon} = setup(t);
    let spy1 = sinon.spy(),
        spy2 = sinon.spy(),
        spy3 = sinon.spy(),
        spy4 = sinon.spy();

    store.when('dispatch', 'dispatch').call(spy1);
    store.when('dispatch', 'COMMIT').call(spy2);
    store.when('commit', 'dispatch').call(spy3);
    store.when('commit', 'COMMIT').call(spy4);

    store.commit('COMMIT');
    await store.dispatch('dispatch');

    t.true(spy1.called);
    t.false(spy2.called);
    t.false(spy3.called);
    t.true(spy4.called);
  });
  test('triggers based on regular expression', function (t) {
    let {store, sinon} = setup(t);
    let spy = sinon.spy();

    store.when(/.*/, /commit/i).call(spy);

    store.commit('COMMIT');
    store.commit('commit');
    store.commit('bob');

    t.true(spy.calledTwice);
  });
  test('triggers for all other options', async function (t) {
    let {store, sinon} = setup(t);
    let spy1 = sinon.spy(), spy2 = sinon.spy();

    store.when('commit', 'COMMIT').call(spy1);
    store.otherwise().call(spy2);

    store.commit('COMMIT');
    store.commit('FOOBAH');
    await store.dispatch('myDispatch');
    await store.dispatch('COMMIT');

    t.true(spy1.calledOnce);
    t.true(spy2.calledThrice);
  });
  test('returns a value', function (t) {
    let {store} = setup(t);
    store.when('dispatch').return('foo');
    store.when('COMMIT').return('bah');

    t.is(store.commit('COMMIT'), 'bah');

    return store.dispatch('dispatch').then(result => {
      t.is(result, 'foo');
    });
  });
  test.cb('returns a hanging promise', function (t) {
    let {store} = setup(t);
    store.when('dispatch').stop();

    store.dispatch('dispatch').then(() => {
      t.fail();
      t.end();
    }, () => {
      t.fail();
      t.end();
    });

    setTimeout(() => {
      t.pass();
      t.end();
    }, 500);
  });
  test('throws an error', function (t) {
    let {store} = setup(t);
    store.when('COMMIT').throw();
    store.when('dispatch').throw();

    t.throws(() => store.commit('COMMIT'));
    return store.dispatch('dispatch')
      .then(() => {
        t.fail()
      }, () => {
        t.pass()
      });
  });
});
