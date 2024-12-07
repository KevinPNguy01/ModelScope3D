import { configureStore } from '@reduxjs/toolkit';
import lightingReducer from "../stores/slices/lighting";
import transformationsReducer from "../stores/slices/transformations";

const store =  configureStore({
    reducer: {
        transformations: transformationsReducer,
        lighting: lightingReducer
    },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;