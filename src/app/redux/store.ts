// eslint-disable-next-line import/no-extraneous-dependencies
import { configureStore } from '@reduxjs/toolkit';
import modal from './reducers/modal';
import buy from './reducers/buy';

const store = configureStore({
  reducer: {
    modal,
    buy
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
