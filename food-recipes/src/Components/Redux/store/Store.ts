import { configureStore} from "@reduxjs/toolkit"
import recipesReducer from '../Recipesreducer'

const recipesStore = configureStore({
      reducer : {
        foodrecipes: recipesReducer
      }
})

export default recipesStore