import rootReducer from './Reducers';
import redux, {createStore, applyMiddleware} from 'redux';

//const createStore = redux.createStore;

const store = createStore(rootReducer, applyMiddleware());

export default store;
