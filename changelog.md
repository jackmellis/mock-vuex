# Change Log

## 1.0.0
- moved entire codebase to typescript and export d.ts files
- dispatching from non-namespaced modules now works correctly
- updated modulenamespace to work properly with latest mapState syntax
- modules are no longer namespaced by default
- added more instance method stubs i.e. `watch` and `replaceState`

## 0.2.1
- accept action objects i.e. `dispatch({ type: 'foo' })`

## 0.2.0
- implemented registerModule and unregisterModule methods

## 0.1.3
- Module actions/mutations/getters can now be non-namespaced by supplying `namespaced : false` in the configuration
- All modules are namespaced by default, but this can be switched off by setting `mockVuex.config.autoNamespace = false`-
- 0.2 will incorporate registerModule and unregisterModule. For now, placeholder methods have been added so method calls will not fall over.

## 0.1.2
- Added missing `rootGetters` argument from the getters method [#4](https://github.com/jackmellis/mock-vuex/issues/4)
- Creating a store with an action and mutation that share the same name did not work. The action would overwrite the mutation [#3](https://github.com/jackmellis/mock-vuex/issues/3)

## 0.1.1
- Fixed [#1](https://github.com/jackmellis/mock-vuex/issues/1) where doing `store.when('dispatch', 'foo').throw()` and then doing `store.dispatch('foo')` would throw an error synchronously rather than return a rejected promise.
- Fixed [#2](https://github.com/jackmellis/mock-vuex/issues/2) where creating a store with a null or array property was trying treat the null/array as an object and creating an invalid module namespace.
