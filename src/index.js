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


    // -- react components
    var greet = function(React) {
        return function(props) {
            return (React.createElement(
                'h1', null,
                props.greet
            ));
        };
    };

    var phrase = function(React) {
        return function(props) {
            return (React.createElement(
                'div', { style: props.styles },
                props.phrase
            ));
        };
    };

    var change = function(React) {
        return function(props) {
            return (React.createElement(
                'button', {
                    onClick: function(e) {
                        e.preventDefault();
                        props.onClick(props.phrases);
                    }
                },
                'change'
            ));
        };
    };

    // -- react containers
    var greetContainer = function(React) {
        var createGreet = greet(React);
        var mapStateToProps = function(state) {
            return { greet: state.greet + ' ' + state.user };
        };
        return connect(mapStateToProps, null, null, { pure: true })(createGreet);
    };

    var phraseContainer = function(React) {

        var createPhrase = phrase(React);

        var mapStateToProps = function(state) {
            return {
                phrase: state.phrase,
                styles: { color: state.colors[Math.floor(Math.random() * (state.colors.length))] }
            };
        };

        return connect(mapStateToProps, null, null, { pure: true })(createPhrase);
    };

    var changePhraseContainer = function(React) {

        var createChange = change(React);

        var mapStateToProps = function(state) {
            return {
                phrases: state.phrases
            };
        };

        var mapDispatchToProps = function(dispatch) {

            return {
                onClick: function(phrases) {
                    phrases = phrases || [];
                    dispatch({
                        type: 'change.phrase',
                        payload: phrases[Math.floor(Math.random() * (phrases.length))]
                    });
                }
            };
        };

        return connect(mapStateToProps, mapDispatchToProps, null, { pure: true })(createChange);
    };


    var app = function(React) {
        return function() {
            var Greet = greetContainer(React);
            var Phrase = phraseContainer(React);
            var ChangePhrase = changePhraseContainer(React);
            return React.createElement('div', null,
                React.createElement(Greet, null),
                React.createElement(Phrase, null),
                React.createElement(ChangePhrase, null)
            );
        };
    };

    // -- REDUX

    // -- constants
    var GREET = 'greet.user';
    var USER_NAME = 'user.name';
    var PHRASE = 'change.phrase';
    var PHRASES = 'add.phrases';
    var COLORS = 'style.colors';

    var initialState = {
        greet: '',
        user: '',
        phrase: '',
        phrases: [
            'Beauty is an enormous, unmerited gift given randomly, stupidly',
            'What are men to rocks and mountains?',
            'Sometimes I can feel my bones straining under the weight of all the lives I’m not living.',
            'The curves of your lips rewrite history.',
            'A dream, all a dream, that ends in nothing, and leaves the sleeper where he lay down, but I wish you to know that you inspired it'
        ],
        colors: ['darkolivegreen', 'cornflowerblue', 'cadetblue', 'darkmagenta']
    };

    var actionCreators = {

        greet: function(value) {
            return {
                type: GREET,
                payload: value
            };
        },
        user: function(value) {
            return {
                type: USER_NAME,
                payload: value
            };
        },
        phrase: function(value) {
            return {
                type: PHRASE,
                payload: value
            };
        }
    };

    // -- reducers
    var reducerUser = function(state, action) {

        state = state || '';

        var actions = {};

        actions[USER_NAME] = function() {
            return action.payload;
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
            return action.payload;
        };
        actions.default = function() {
            return state;
        };

        var reduce = actions[action.type] || actions.default;
        return reduce();
    };

    var reducerGreet = function(state, action) {

        state = state || '';

        var actions = {};

        actions[GREET] = function() {
            return action.payload;
        };
        actions.default = function() {
            return state;
        };

        var reduce = actions[action.type] || actions.default;
        return reduce();
    };

    var reducerPhrases = function(state, action) {

        state = state || '';

        var actions = {};

        actions[PHRASES] = function() {
            return action.payload;
        };

        actions.default = function() {
            return state;
        };

        var reduce = actions[action.type] || actions.default;
        return reduce();
    };

    var reducerColors = function(state, action) {

        state = state || '';

        var actions = {};

        actions[COLORS] = function() {
            return action.payload;
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
            phrase: reducerPhrase,
            greet: reducerGreet,
            phrases: reducerPhrases,
            colors: reducerColors
        });
    };

    // -- store
    var store = createStore(rootReducer(), initialState);

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
    store.dispatch(actionCreators.greet('Hello'));
    store.dispatch(actionCreators.user('Alice'));

}(window));
