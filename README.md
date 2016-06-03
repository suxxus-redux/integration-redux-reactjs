# Integration redux react
redux studies

***Returns a React component class that injects state and action creators into your component according to the specified options.***

## Clone the repo & install
```
git clone https://github.com/suxxuscomp/integration-redux-reactjs.git
cd ./integration-redux-reactjs
npm install
```
## Usage
cd ./src/scripts

**node index.js**

## Tips
```
<provider store>
  props
    -store
    -children

```
* Makes the Redux store available to the connect() calls in the component hierarchy below.

```
 connect
   arguments
    -mapStateToProps(Function)
    -mapDispatchToProps(Object or Function)
    -mergeProps(Function)
    -options(Object)

```
* Connects a React component to a Redux store.
* Returns a new, connected component class.

## Links
[react-redux Api](https://github.com/reactjs/react-redux/blob/master/docs/api.md#api)
