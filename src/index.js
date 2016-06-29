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
                'p', null,
                value.greet
            ));
        };
    };

    var somethingNice = function(React) {
        return function(value) {
            return (React.createElement(
                'div', { style: value.styles },
                value.phrase
            ));
        };
    };

    var changePhrase = function(React) {
        return function(value) {
            return (React.createElement(
                'button', {
                    onClick: function(e) {
                        e.preventDefault();
                        value.onClick();
                    },
                    style: { display: value.display }
                },
                'change'
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
                phrase: getPhrase(state.phrases),
                styles: state.styles
            };
        };

        return connect(mapStateToProps)(createSomethingNice);
    };

    var changePhraseContainer = function(React) {

        var createChangePhrase = changePhrase(React);

        var getColor = function() {
            var colors = ['blue', 'red', 'green'];
            return colors[Math.floor(Math.random() * (colors.length))];
        };

        var mapStateToProps = function(state) {
            return { 'display': state.user === 'John' ? 'none' : 'block' };
        };

        var mapDispatchToProps = function(dispatch) {
            return {
                onClick: function() {
                    dispatch({
                        type: 'add.styles',
                        styles: { color: getColor(), fontStyle: 'italic' }
                    });
                }
            };
        };

        return connect(mapStateToProps, mapDispatchToProps)(createChangePhrase);
    };

    var app = function(React) {
        return function() {
            var Greet = greetContainer(React);
            var SomethingNice = somethingNiceContainer(React);
            var ChangePhrase = changePhraseContainer(React);
            return React.createElement('div', null,
                React.createElement(Greet, null),
                React.createElement(SomethingNice, null),
                React.createElement(ChangePhrase, null)
            );
        };
    };

    // -- redux
    var USER_NAME = 'user.name';
    var PHRASE = 'selected.phrases';
    var ADD_STYLES = 'add.styles';

    var initialState = { user: '', phrases: '', styles: {} };

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
        },
        addStyle: function(value) {
            return {
                type: ADD_STYLES,
                styles: { color: value }
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

    var reducerAddStyles = function(state, action) {
        state = state || '';
        var actions = {};
        actions[ADD_STYLES] = function() {
            return action.styles;
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
            phrases: reducerPhrase,
            styles: reducerAddStyles
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
        store.dispatch(actionCreators.phrase(['Is your day', 'You are nice', 'Good luck']));
    }, 2000);

}(window));
