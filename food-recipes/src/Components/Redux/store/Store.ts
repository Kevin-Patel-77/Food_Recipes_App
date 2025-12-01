import { configureStore} from "@reduxjs/toolkit"
import recipesReducer from '../RecipesReducer'
import cartReducer from '../CartReducers'

const recipesStore = configureStore({
      reducer : {
        foodrecipes: recipesReducer,
        foodCart : cartReducer ,
      }
})

export type RootState = ReturnType<typeof recipesStore.getState>;
export type AppDispatch = typeof recipesStore.dispatch;


export default recipesStore