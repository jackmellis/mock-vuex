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

test.group('expect / assert', test => {
  test('expect accepts a method and name', t => {
   let store = mock();
   let spy = Sinon.spy();
   store.expect('commit', 'COMMIT').call(spy);

   store.commit('COMMIT');
   t.true(spy.called);
 });
 test('accepts a method and name regexp', async t => {
   let store = mock();
   let spy = Sinon.spy();
   store.expect(/dispatch/, /doSomething/).call(spy);

   await store.dispatch('doSomething');
   t.true(spy.called);
 });
 test('accepts just a name string', t => {
   let store = mock();
   let spy = Sinon.spy();
   store.expect('COMMIT').call(spy);

   store.commit('COMMIT');
   t.true(spy.called);
 });
 test('accepts just a name regexp', t => {
   let store = mock();
   let spy = Sinon.spy();
   store.expect(/commit/).call(spy);

   store.commit('commit');
   t.true(spy.called);
 });
 test('returns response object from expect', t => {
   let store = mock();
   store.expect('dispatch', 'dsp').return('foo');

   return store.dispatch('dsp').then(response => {
     t.is(response, 'foo');
   });
 });
 test('assert does not throw if expected calls have been made', t => {
   let store = mock();

   store.expect('commit', 'COMMIT');
   store.expect('dispatch', 'dispatch');

   store.commit('COMMIT');
   store.dispatch('dispatch');

   t.notThrows(() => store.assert());
 });
 test('assert throws if any expect has not been called', t => {
   let store = mock();

   store.expect('commit', 'COMMIT');
   store.expect('commit', 'COMMIT2');
   store.otherwise();

   store.commit('COMMIT');
   store.commit('COMMIT3');

   t.throws(() => store.assert());
 });
 test('assert resets after being called', t => {
   let store = mock();

   store.expect('commit', 'COMMIT');
   store.expect('dispatch', 'dispatch');
   store.otherwise();

   store.commit('COMMIT');

   t.throws(() => store.assert());

   // should start again
   t.notThrows(() => store.assert());
 });
 test('can specify a call count that must be met', t => {
   let store = mock();

   store.expect('commit', 'COMMIT', 3);
   store.expect('dispatch', 'dispatch', 0);

   t.throws(() => store.assert());

   store.expect('commit', 'COMMIT', 3);
   store.expect('dispatch', 'dispatch', 0);

   store.commit('COMMIT');
   store.commit('COMMIT');
   store.commit('COMMIT');

   t.notThrows(() => store.assert());
 });
});
