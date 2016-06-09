'use strict';

(function(win) {
    var redux = win.Redux,
        reactRedux = win.ReactRedux,
        react = win.React,
        render = win.ReactDOM.render,
        Provider = reactRedux.Provider,
        createStore = redux.createStore,
        connect = reactRedux.connect,
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

    // -- render to DOM
    var props = { name: 'John', quotes: ['have a nice day', 'today will be a great day'] };
    var App = app(React);

    render(App(props),
        document.querySelector('#root'));

}(window));
