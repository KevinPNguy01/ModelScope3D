import { configureStore } from '@reduxjs/toolkit';
import lightingReducer from "../stores/slices/lighting";
import settingsReducer from "../stores/slices/settings";
import transformationsReducer from "../stores/slices/transformations";

const store =  configureStore({
    reducer: {
        transformations: transformationsReducer,
        lighting: lightingReducer,
        settings: settingsReducer
    },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;