import { configureStore} from "@reduxjs/toolkit"
import recipesReducer from '../RecipesReducer'

const recipesStore = configureStore({
      reducer : {
        foodrecipes: recipesReducer
      }
})

export type RootState = ReturnType<typeof recipesStore.getState>;
export type AppDispatch = typeof recipesStore.dispatch;


export default recipesStore