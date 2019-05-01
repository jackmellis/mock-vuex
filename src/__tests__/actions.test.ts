import test from 'ava';
import sinon from 'sinon';
import mock from '..';

test('calls the action method', function (t) {
  let spy = sinon.spy();
  let store = mock({
    actions : {
      test : spy,
    },
  });

  return store.dispatch('test')
    .then(() => {
      t.true(spy.called);
    });
});
test('accepts an action object', function (t) {
  let spy = sinon.spy();
  let store = mock({
    actions : {
      test : spy,
    },
  });

  return store.dispatch({ type: 'test' })
    .then(() => {
      t.true(spy.called);
    });
});
test('calls a nested action method', function (t) {
  let spy = sinon.spy();

  let store = mock({
    moduleA : {
      moduleB : {
        namespaced: true,
        actions : {
          test : spy,
        },
      },
    },
  });

  return store.dispatch('moduleA/moduleB/test').then(() => {
    t.true(spy.called);
  });
});
test('calls a non-namespaced method', async function (t) {
  let spy1 = sinon.spy();
  let spy2 = sinon.spy();
  let spy3 = sinon.spy();

  let store = mock({
    rootModule: {
      namespaced: true,
      modules: {
        moduleA : {
          namespaced : false,
          actions : {
            test : spy1,
          },
        },
        moduleB : {
          namespaced: false,
          actions: {
            test: spy2,
          },
        },
        moduleC : {
          namespaced: true,
          actions: {
            test: spy3,
          },
        },
      },
    },
  });

  await store.dispatch('test');
  t.true(spy1.called);
  t.true(spy2.called);
  t.false(spy3.called);

  await store.dispatch('rootModule/moduleC/test');
  t.true(spy3.called);
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
      namespaced: true,
      state : {
        loading : true,
      },
      actions : {
        test({state}: any){
          return state.loading;
        },
      },
    },
  });

  return store.dispatch('moduleA/test').then(result => {
    t.is(result, true);
  });
});

test('non-namespaced has access to local state', function (t) {
  let store = mock({
    moduleA : {
      namespaced: false,
      state : {
        loading : true,
      },
      actions : {
        test({state}: any){
          return state.loading;
        },
      },
    },
  });

  return store.dispatch('test').then(result => {
    t.is(result, true);
  });
});
test('has access to root state', function (t) {
  let store = mock({
    loading : true,
    moduleA : {
      namespaced: true,
      state : {
        loading : false,
      },
      actions : {
        test({rootState}: any){
          return rootState.loading;
        },
      },
    },
  });

  return store.dispatch('moduleA/test').then(result => {
    t.is(result, true);
  });
});
test('has access to local dispatch', function (t) {
  let store = mock({
    moduleA : {
      actions : {
        test({dispatch}: any){
          return dispatch('test2').then((response: any) => response);
        },
        test2(){
          return 'success';
        },
      },
    },
  });

  return store.dispatch('moduleA/test').then(result => {
    t.is(result, 'success');
  });
});
test('has access to local commit', function (t) {
  let spy = sinon.spy();

  let store = mock({
    moduleA : {
      mutations : {
        TEST : spy,
      },
      actions : {
        test({commit}: any){
          commit('TEST');
        },
      },
    },
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
      },
    },
  });

  return store.dispatch('test', 'fred').then(result => {
    t.is(result, 'fred');
  });
});

test('can have the same name as a mutation', function (t) {
  let mutationSpy = sinon.spy();
  let actionSpy = sinon.spy();

  let store = mock({
    mutations : {
      thing : mutationSpy,
    },
    actions : {
      thing : actionSpy,
    },
  });

  store.commit('thing');
  return store.dispatch('thing').then(() => {
    t.true(mutationSpy.called);
    t.true(actionSpy.called);
  });
});
