import { configureStore} from "@reduxjs/toolkit"
import recipesReducer from '../RecipesReducer'

const recipesStore = configureStore({
      reducer : {
        foodrecipes: recipesReducer
      }
})

export default recipesStore