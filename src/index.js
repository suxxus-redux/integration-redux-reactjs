'use strict';
(function(win) {
    // var redux = require('redux'),
    //     reactRedux = require('react-redux'),
    //     react = require('react'),
    //     reactDom = require('react-dom'),
    //     //reactDOMServer = require('react-dom/server'),
    //     Provider = reactRedux.Provider,
    //     connect = reactRedux.connect,
    //     createStore = redux.createStore,
    //     bindActionCreators = redux.bindActionCreators;

    var redux = win.Redux,
        reactRedux = win.ReactRedux,
        react = win.React,
        reactDom = win.ReactDOM,
        Provider = reactRedux.Provider,
        createStore = redux.createStore,
        connect = reactRedux.connect,
        bindActionCreators = redux.bindActionCreators;


    var SET_NAME = 'set.name';
    var initialState = { name: 'John' };

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

    //----------------------------------------------------------------
    var reactComponent = function(React) {
        return function(value) {
            return (React.createElement('p', {}, value.name));
        }
    };

    var reactComponentContainer = function(
        connect,
        component,
        mapStateToProps,
        actionCreators,
        mergeProps,
        options) {
        return connect(mapStateToProps, actionCreators, mergeProps, options)(component);
    };

    var app = function(React) {
        return function(child) {
            return function(store) {
                return (React.createElement('div', { className: 'container' }, child(store)));
            }
        }
    };

    var mapStateToProps = function(state) {
        console.log('state ', state);
        return { name: state.name };
    };

    var mapDispatchToProps = function(dispatch) {
        return { actions: bindActionCreators(actionCreators, dispatch) }
    };

    var especificActionCreator = function(dispatch) {
        //return bindActionCreators(actionCreators.user, dispatch);
        return {
            foo: function() {
                console.log(121212121212);
            }
        };
    };

    var createReactComponent = reactComponent(react);

    var creacteReactComponentContainer = reactComponentContainer(
        connect,
        createReactComponent,
        mapStateToProps,
        actionCreators,
        null, { pure: true });

    var RootComponent = app(react)(creacteReactComponentContainer);
    //console.log(new creacteReactComponentContainer({store:store}).WrappedComponent);

    // CONNECT (options)
    // console.log('=== Inject just dispatch and don`t listen to store ===');
    // console.log(connect()(createReactComponent));
    // console.log(' ---------------------------------------------------------------  ');
    // console.log('=== Inject all action creators (user, ...) without subscribing to the store === ');
    // console.log(connect(null, actionCreators)(createReactComponent));
    // console.log(' ---------------------------------------------------------------  ');
    // console.log('=== Inject dispatch and name === ');
    // console.log(connect(mapStateToProps)(createReactComponent));
    // console.log(' ---------------------------------------------------------------  ');
    // console.log('=== Inject name and actionCreators === ');
    // console.log(connect(mapStateToProps, actionCreators)(createReactComponent));
    // console.log(' ---------------------------------------------------------------  ');
    // console.log('=== Inject name and specificActionCreators === ');
    // console.log(connect(mapStateToProps, especificActionCreator)(createReactComponent));

    //console.log(RootComponent(store).props.children.props);

    // var CommentBox = React.createClass({
    //     displayName: 'CommentBox',
    //     render: function(name) {
    //         return (
    //             React.createElement('div', { className: "commentBox" },
    //                 "Hello, world! I am a CommentBox. " + name
    //             )
    //         );
    //     }
    // });


    // PROVIDER
    // store (Redux Store): The single Redux store in your application.
    // children (ReactElement) The root of your component hierarchy.
    var createProvider = function(React) {
        return function(provider, store, children) {
            return React.createElement(provider, { store: store },
                React.createElement(children)
            );
        };
    };

    var myApp = createProvider(react)(Provider, store, CommentBox);

    console.log(' ---------------------------------------------------------------  ');
    console.log(' === myApp === ');
    reactDom.render(myApp, win.document.querySelector('#root'));
    //reactDom.render(app(react)(createReactComponent)(initialState), win.document.querySelector('#root'));
    //console.log(RootComponent);
    console.log(' ---------------------------------------------------------------  ');
    //    console.log(' --------------------- ' + createProvider(react)()  + ' -------------------------  ');

    console.log('App,  ', myApp);
    // console.log(myApp.props.children.props.children);
    // console.log(myApp);
    // var tmp = reactDOMServer.renderToString(RootComponent(store));
    // console.log(tmp);

}(window));
