// 引入createStore，专门用于创建redux中最为核心的store对象
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
// 引入createStore，专门用于创建redux中最为核心的store对象
import thunk from 'redux-thunk';
// 使用 redux-devtools-extension 查看 Redux 中状态变化
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducers';

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
