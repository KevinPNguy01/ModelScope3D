import { configureStore } from '@reduxjs/toolkit';
import transformationsReducer from "../stores/slices/transformations";

const store =  configureStore({
    reducer: {
        transformations: transformationsReducer
    },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;