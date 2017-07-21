# Change Log

## 0.1.2
- Added missing `rootGetters` argument from the getters method [#4](https://github.com/jackmellis/mock-vuex/issues/4)
- Creating a store with an action and mutation that share the same name did not work. The action would overwrite the mutation [#3](https://github.com/jackmellis/mock-vuex/issues/3)

## 0.1.1
- Fixed [#1](https://github.com/jackmellis/mock-vuex/issues/1) where doing `store.when('dispatch', 'foo').throw()` and then doing `store.dispatch('foo')` would throw an error synchronously rather than return a rejected promise.
- Fixed [#2](https://github.com/jackmellis/mock-vuex/issues/2) where creating a store with a null or array property was trying treat the null/array as an object and creating an invalid module namespace.