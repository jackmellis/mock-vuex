# mock-vuex
A Mock version of Vuex to make unit testing easier

## Install
`npm install mock-vuex --save-dev`

## Create with state
```js
import mock from 'mock-vuex';
const store = mock({
  users : {
    user : { id : 1, name : 'user1' }
  }
});
```

## Create with getters/actions/mutations/modules
```js
import mock from 'mock-vuex';
const store = mock({
  modules : {
    users : {
      state : {
        user : { id : 1, name : 'user1' }
      },
      actions : {
        setUserName({state, commit}, payload){
          /* ... */
        }
      },
      mutations : {
        SET_USER_NAME(state, payload){
          /* ... */
        }
      }
    }
  }
});
```

## Intercept commit/dispatch calls
```js
store.when('dispatch', 'setUserName').return('success'); // calling store.dispatch('setUserName') will resolve with 'success'
store.expect('commit', 'SET_USER_NAME'); // adds a check to ensure a commit has been called

store.assert(); // throws if SET_USER_NAME has not been called
```

Full Documentation:  
https://jackmellis.gitbooks.io/vuenit/content/store/introduction.html
