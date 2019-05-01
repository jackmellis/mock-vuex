/* eslint-disable no-param-reassign */
import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';
import mock from '../..';
import vuenit from 'vuenit';
import {mapActions} from 'vuex';

const test = anyTest as TestInterface<any>;

test.beforeEach(function (t) {
  let component = {
    name : 'test-component',
    template : '<div></div>',
    methods : Object.assign(
      mapActions([ 'a' ]),
      mapActions('moduleA', [ 'b' ]),
      mapActions('moduleA/moduleB', [ 'c' ]),
      mapActions([ 'd' ])
    ),
  };

  let spyA = sinon.spy(),
    spyB = sinon.spy(),
    spyC = sinon.spy(),
    spyD = sinon.spy();

  let store = mock({
    actions : {
      a : spyA,
    },
    modules : {
      moduleA : {
        namespaced: true,
        actions : {
          b : spyB,
        },
        modules : {
          moduleB : {
            namespaced: true,
            actions : {
              c : spyC,
            },
            modules: {
              moduleC: {
                namespaced: false,
                actions: {
                  d: spyD,
                },
              },
            },
          },
        },
      },
    },
  });

  let vm = vuenit.component(component, {store});

  t.context = {sinon, component, store, vm, spyA, spyB, spyC, spyD};
});

test('maps state to mock store properties', function (t) {
  let {vm, spyA, spyB, spyC, spyD} = t.context;

  return vm.a()
    .then(() => {
      t.true(spyA.called, 'spyA was not called');

      return vm.b();
    })
    .then(() => {
      t.true(spyB.called, 'spyB was not called');

      return vm.c();
    })
    .then(() => {
      t.true(spyC.called, 'spyC was not called');

      return vm.d();
    })
    .then(() => {
      t.true(spyD.called, 'spyD was not called');
    });
});
