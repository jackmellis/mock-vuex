/* eslint-disable no-param-reassign */
import anyTest, { TestInterface } from 'ava';
import sinon from 'sinon';
import mock from '../..';
import vuenit from 'vuenit';
import {mapMutations} from 'vuex';

const test = anyTest as TestInterface<any>;

test.beforeEach(function (t) {
  let component = {
    name : 'test-component',
    template : '<div></div>',
    methods : Object.assign(
      mapMutations([ 'a' ]),
      mapMutations('moduleA', [ 'b' ]),
      mapMutations('moduleA/moduleB', [ 'c' ]),
      mapMutations([ 'd' ])
    ),
  };

  let spyA = sinon.spy(), 
    spyB = sinon.spy(),
    spyC = sinon.spy(),
    spyD = sinon.spy();

  let store = mock({
    mutations : {
      a : spyA,
    },
    modules : {
      moduleA : {
        namespaced: true,
        mutations : {
          b : spyB,
        },
        modules : {
          moduleB : {
            namespaced: true,
            mutations : {
              c : spyC,
            },
            modules: {
              moduleC: {
                namespaced: false,
                mutations: {
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

  vm.a();
  vm.b();
  vm.c();
  vm.d();

  t.true(spyA.called);
  t.true(spyB.called);
  t.true(spyC.called);
  t.true(spyD.called);
});
