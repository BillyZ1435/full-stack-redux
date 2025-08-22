import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer'

export default function makeStore() {
  return configureStore({ reducer: rootReducer });
}