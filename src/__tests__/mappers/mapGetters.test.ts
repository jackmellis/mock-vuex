/* eslint-disable no-param-reassign */
import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';
import mock from '../..';
import vuenit from 'vuenit';
import {mapGetters} from 'vuex';

const test = anyTest as TestInterface<{
  component: any,
  store: any,
  vm: any,
  sinon: typeof sinon,
}>;

test.beforeEach(function (t) {
  let component = {
    name : 'test-component',
    template : '<div></div>',
    computed : Object.assign(
      mapGetters([ 'a' ]),
      mapGetters('moduleA', [ 'b' ]),
      mapGetters('moduleA/moduleB', [ 'c' ]),
      mapGetters([ 'd' ]),
    ),
  };

  let store = mock({
    state : {
      loading : 1,
    },
    getters : {
      a : state => state.loading,
    },
    modules : {
      moduleA : {
        namespaced: true,
        state : {
          loading : 2,
        },
        getters : {
          b : state => state.loading,
        },
        modules : {
          moduleB : {
            namespaced: true,
            state : {
              loading : 3,
            },
            getters : {
              c : state => state.loading,
            },
            modules: {
              moduleC: {
                namespaced: false,
                state: {
                  loading: 4,
                },
                getters: {
                  d: state => state.loading,
                },
              },
            },
          },
        },
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
  t.is(vm.d, 4);
});
