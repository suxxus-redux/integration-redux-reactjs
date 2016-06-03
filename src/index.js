'use strict';
var redux = require('redux');
var createStore = redux.createStore;
var bindActionCreators = redux.bindActionCreators;
var initialState = { name: 'John' };

var SET_NAME = 'set.name';

var actionCreators = {
    user: function(name) {
        return {
            type: SET_NAME,
            name: name
        };
    }
};

var reducer = function(state, action) {
    var actions = {};
    actions[SET_NAME] = function() {
        return {
            name: action.name
        };
    };
    actions.default = function() {
        return state;
    };

    var reduce = actions[action.type] || actions.default;

    return reduce();
};

var store = createStore(reducer, initialState);

console.log('state.name should be John: ', store.getState().name === 'John');

// dispatch an action
store.dispatch(actionCreators.user('Marie Ann'));
console.log('state should be Marie Ann: ', store.getState().name === 'Marie Ann');

/*
Turns an object whose values are action creators,
into an object with the same keys,
but with every action creator wrapped into
a dispatch call so they may be invoked directly.
*/
var boundActionCreators = bindActionCreators(actionCreators, store.dispatch);
var setUserNameToAlice = function(setUserName) {
    // pure function
    setUserName('Alice');
};
setUserNameToAlice(boundActionCreators.user);
console.log('state should be Alice: ', store.getState().name === 'Alice');
