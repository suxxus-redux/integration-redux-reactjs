'use strict';

(function(win) {

    var redux = win.Redux,
        reactRedux = win.ReactRedux,
        react = win.React,
        render = win.ReactDOM.render,
        Provider = reactRedux.Provider,
        createStore = redux.createStore,
        connect = reactRedux.connect,
        combineReducers = redux.combineReducers;

    // -- react
    var greet = function(React) {
        return function(value) {
            return (React.createElement(
                'p', {},
                value.greet
            ));
        };
    };

    var somethingNice = function(React) {
        return function(value) {
            return (React.createElement(
                'em', {},
                value.phrase
            ));
        };
    };

    var greetContainer = function(React) {
        var createGreet = greet(React);
        var mapStateToProps = function(state) {
            return { greet: 'Hello ' + state.user };
        };
        return connect(mapStateToProps)(createGreet);
    };

    var somethingNiceContainer = function(React) {

        var createSomethingNice = somethingNice(React);

        var getPhrase = function(phrases) {
            phrases = phrases || [];
            var ranNum = Math.floor(Math.random() * (phrases.length));
            return phrases[ranNum];
        };

        var mapStateToProps = function(state) {
            return {
                phrase: getPhrase(state.phrases)
            };
        };

        return connect(mapStateToProps)(createSomethingNice);
    };

    var app = function(React) {
        return function() {
            var Greet = greetContainer(React);
            var SomethingNice = somethingNiceContainer(React);
            return React.createElement('div', null,
                React.createElement(Greet, null),
                React.createElement(SomethingNice, null)
            );
        };
    };

    // -- redux
    var USER_NAME = 'user.name';
    var PHRASE = 'selected.phrases';
    var initialState = { user: '', phrases: '' };

    var actionCreators = {
        user: function(value) {
            return {
                type: USER_NAME,
                name: value
            };
        },
        phrase: function(value) {
            return {
                type: PHRASE,
                phrases: value
            };
        }
    };

    var reducerUser = function(state, action) {
        state = state || '';
        var actions = {};
        actions[USER_NAME] = function() {
            return action.name;
        };
        actions.default = function() {
            return state;
        };

        var reduce = actions[action.type] || actions.default;
        return reduce();
    };

    var reducerPhrase = function(state, action) {
        state = state || '';
        var actions = {};
        actions[PHRASE] = function() {
            return action.phrases;
        };
        actions.default = function() {
            return state;
        };

        var reduce = actions[action.type] || actions.default;
        return reduce();
    };

    var rootReducer = function() {
        return combineReducers({
            user: reducerUser,
            phrases: reducerPhrase
        });
    };

    var store = createStore(rootReducer(), initialState);

    console.log('state should be {user:\'\', phrase: \'\'}: ', (store.getState().user === '' && store.getState().phrase === ''));

    store.dispatch(actionCreators.user('John'));
    console.log('state should be {user:\'John\', phrase: \'\'}: ', (store.getState().user === 'John' && store.getState().phrase === ''));

    store.dispatch(actionCreators.phrase(['Have a nice day', 'Today will be a great day']));
    console.log('state should be {user:\'John\', phrases: [\'Have a nice day\', \'Today will be a great day\']}: ', (store.getState().user === 'John' && store.getState().phrases.length === 2));

    // -- provider
    var createProvider = function(React) {
        return function(provider, st, children) {
            return React.createElement(provider, { store: st }, React.createElement(children, null));
        };
    };

    // -- render
    var App = app(react);
    var provider = createProvider(react)(Provider, store, App);

    render(provider,
        win.document.querySelector('#root'));


    // -- dispatch actions
    win.setTimeout(function() {
        store.dispatch(actionCreators.user('Alice'));
        store.dispatch(actionCreators.phrase(['Is your day', 'You are nice']));
    }, 2000);

}(window));
