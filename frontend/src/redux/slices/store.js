import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import uiReducer from "./uiSlice.js";
const store = configureStore({
  reducer: {
    auth:authReducer,
    ui: uiReducer,
  },
});


export default store;