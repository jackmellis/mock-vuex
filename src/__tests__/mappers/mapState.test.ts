/* eslint-disable no-param-reassign */
import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';
import mock from '../..';
import vuenit from 'vuenit';
import {mapState} from 'vuex';

const test = anyTest as TestInterface<{
  sinon: typeof sinon,
  component: object,
  store: any,
  vm: any,
}>;

test.beforeEach(function (t) {
  let component = {
    name : 'test-component',
    template : '<div></div>',
    computed : Object.assign(
      mapState({
        a : (state: any) => state.loading,
      }),
      mapState('moduleA', {
        b : (state: any) => state.loading,
      }),
      mapState('moduleA/moduleB', {
        c : (state: any) => state.loading,
      })
    ),
  };

  let store = mock({
    loading : 1,
    moduleA : {
      loading : 2,
      moduleB : {
        loading : 3,
      },
    },
  });

  let vm = vuenit.component(component, {store});

  t.context = {sinon, component, store, vm};
});

test('maps state to mock store properties', function (t) {
  let {vm} = t.context;

  t.is(vm.a, 1);
  t.is(vm.b, 2);
  t.is(vm.c, 3);
});
