'use strict';

(function(win) {

    var redux = win.Redux,
        reactRedux = win.ReactRedux,
        react = win.React,
        render = win.ReactDOM.render,
        Provider = reactRedux.Provider,
        createStore = redux.createStore,
        connect = reactRedux.connect,
        combineReducers = redux.combineReducers,
        bindActionCreators = redux.bindActionCreators;

    // -- react comps

    var greet = function(React) {
        return function(value) {
            return (React.createElement(
                'p', {},
                value
            ));
        }
    };

    var somethingNice = function(React) {
        return function(value) {
            return (React.createElement(
                'em', {},
                value
            ));
        }
    };

    var greetContainer = function(React) {

        return function(props) {

            var createGreet = greet(React);

            var name = props && props.name ?
                props.name :
                'name should be defined';

            var sayHello = 'Hello ' + name;
            var Greet = createGreet(sayHello);
            return Greet;
        };
    };

    var somethingNiceContainer = function(React) {

        return function(props) {

            var createSomethingNice = somethingNice(React);
            var quotes = props && props.quotes ?
                props.quotes : [];
            var ranNum = Math.floor(Math.random() * (quotes.length))
            var quote = quotes[ranNum];

            var SomethingNice = createSomethingNice(quote);

            return SomethingNice;
        }
    };

    var app = function(React) {

        return function(props) {

            var Greet = greetContainer(React)(props);
            var SomethingNice = somethingNiceContainer(React)(props);

            return React.createElement('div', {},
                Greet,
                SomethingNice
            );
        };
    };

    // -- redux

    var USER_NAME = 'user.name';
    var PHRASE = 'selected.phrase';
    var initialState = { user: '', phrase: '' };

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
                phrase: value
            };
        }
    };

    var reducerUser = function(state, action) {
        state = state || '';
        var actions = {};
        actions[USER_NAME] = function() {
            return action.name
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
            return action.phrase;
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
            phrase: reducerPhrase
        });
    };

    var store = createStore(rootReducer(), initialState);

    console.log('state should be {user:\'\', phrase: \'\'}: ', (store.getState().user === '' && store.getState().phrase === ''));

    store.dispatch (actionCreators.user('John'));

    console.log('state should be {user:\'John\', phrase: \'\'}: ', (store.getState().user === 'John' && store.getState().phrase === ''));

    store.dispatch (actionCreators.phrase('Have a nice day'));

    console.log('state should be {user:\'John\', phrase: \'Have a nice day\'}: ', (store.getState().user === 'John' && store.getState().phrase === 'Have a nice day'));


    // -----------------------------------------------
    /*    // -- render to DOM
        var props = { name: 'John', quotes: ['have a nice day', 'today will be a great day'] };
        var App = app(React);

        render(App(props),
            document.querySelector('#root'));
    */
}(window));
