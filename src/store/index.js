import reducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({reducer})

export { store };
