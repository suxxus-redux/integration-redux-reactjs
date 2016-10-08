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


    // -- constants
    var GREET = 'greet.user';
    var USER_NAME = 'user.name';
    var CHANGE_PHRASE = 'change.phrase';
    var ADD_PHRASES = 'add.phrases';
    var COLORS = 'style.colors';


    // -- react STATELESS UI components
    var greet = function(React) {

        var tmp = function(props) {
            return (React.createElement(
                'h1', null,
                props.greet
            ));
        };

        tmp.propTypes = {
            greet: React.PropTypes.string.isRequired
        };

        return tmp;
    };

    var phrase = function(React) {

        var tmp = function(props) {
            return (React.createElement(
                'div', {
                    style: props.styles
                },
                props.phrase
            ));
        };

        tmp.propTypes = {
            styles: React.PropTypes.object.isRequired,
            phrase: React.PropTypes.string
        };

        return tmp;
    };

    var change = function(React) {

        var tmp = function(props) {
            return (React.createElement(
                'button', {
                    onClick: props.onClick
                },
                'change phrase'
            ));
        };

        tmp.propTypes = {
            onClick: React.PropTypes.func.isRequired
        };

        return tmp;
    };

    // -- react components containers
    var greetContainer = function(React) {

        var createGreet = greet(React);

        var mapStateToProps = function(state) {
            return { greet: state.greet + ' ' + state.user };
        };

        return connect(mapStateToProps)(createGreet);
    };

    var phraseContainer = function(React) {

        var createPhrase = phrase(React);

        var mapStateToProps = function(state) {
            return {
                phrase: state.phrases[Math.floor(Math.random() * (state.phrases.length))],
                styles: { color: state.colors[Math.floor(Math.random() * (state.colors.length))] }
            };
        };

        return connect(mapStateToProps)(createPhrase);
    };

    var changePhraseContainer = function(React) {

        var createChange = change(React);

        var mapDispatchToProps = function(dispatch) {

            return {
                onClick: function(e) {
                    e.preventDefault();
                    dispatch({
                        type: CHANGE_PHRASE
                    });
                }
            };
        };

        return connect(null, mapDispatchToProps, null, { pure: true })(createChange);
    };

    // -- all App components
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

    // -- ===========
    // -- REDUX
    // -- ===========


    var initialState = {
        greet: '',
        user: '',
        phrases: [],
        changePhrase: '',
        colors: ''
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
        addPhrases: function(value) {
            return {
                type: ADD_PHRASES,
                payload: value
            };
        },
        addColors: function(value) {
            return {
                type: COLORS,
                payload: value
            };
        }
    };

    // -- reducers
    // If the state passed to the reducer is undefined,
    // you must explicitly return the initial state.
    // The initial state may not be undefined

    var reducerUser = function(state, action) {

        var auxState = state || '';

        if (action.type === USER_NAME) {
            return action.payload;
        }

        return auxState;
    };

    var reducerGreet = function(state, action) {

        var auxState = state || '';

        if (action.type === GREET) {
            return action.payload;
        }

        return auxState;
    };

    var reducerPhrases = function(state, action) {

        var auxState = state || '';

        if (action.type === ADD_PHRASES) {
            return action.payload;
        }

        return auxState;
    };

    var reducerColors = function(state, action) {

        var auxState = state || '';

        if (action.type === COLORS) {
            return action.payload;
        }

        return auxState;
    };

    var reducerChangePhrase = function(state, action) {

        var auxState = state || false;

        if (action.type === CHANGE_PHRASE) {
            return !auxState;
        }

        return auxState;
    };

    var rootReducer = function() {
        return combineReducers({
            user: reducerUser,
            greet: reducerGreet,
            changePhrase: reducerChangePhrase,
            phrases: reducerPhrases,
            colors: reducerColors
        });
    };

    // -- store
    var store = createStore(rootReducer(), initialState);

    // -- provider
    var createProvider = function(React) {
        return function(provider, st, application) {
            return React.createElement(provider, { store: st }, React.createElement(application, null));
        };
    };

    // -- render
    var App = app(react);
    var provider = createProvider(react)(Provider, store, App);

    render(provider,
        win.document.querySelector('#root'));

    // -- dispatch actions
    store.dispatch(actionCreators.addColors(['darkolivegreen', 'cornflowerblue', 'cadetblue', 'darkmagenta']));
    store.dispatch(actionCreators.addPhrases([
        'Beauty is an enormous, unmerited gift given randomly, stupidly',
        'What are men to rocks and mountains?',
        'Sometimes I can feel my bones straining under the weight of all the lives I’m not living.',
        'The curves of your lips rewrite history.',
        'A dream, all a dream, that ends in nothing, and leaves the sleeper where he lay down, but I wish you to know that you inspired it'
    ]));
    store.dispatch(actionCreators.greet('Hello'));
    store.dispatch(actionCreators.user('Alice'));

}(window));
