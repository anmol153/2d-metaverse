import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user.jsx'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'
import persistReducer from 'redux-persist/es/persistReducer'

const rootReduce = combineReducers({user: userReducer})

const persistConfig = {
    key:"root",
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig,rootReduce)
export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export const persister = persistStore(store);