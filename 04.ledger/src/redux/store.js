import { legacy_createStore as creatStrore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import Reducer from './reducer';

export default creatStrore(Reducer, composeWithDevTools(applyMiddleware(thunk)));
