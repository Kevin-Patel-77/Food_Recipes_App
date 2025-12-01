import { createSlice } from "@reduxjs/toolkit";
import type { Recipe } from "./RecipesReducer";


export type CartItem = Recipe & {quantity : number}

type initial = {
    count : number
    items : CartItem[]
}

const initialState: initial = {
    count : 0,
    items : []
} 

const cartReducer = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addCart(state , action){
           const exisitng = state.items.find((i)=> i.id == action.payload.id)
           
           if(exisitng){
             exisitng.quantity +=1
           }else{
            state.items.push({...action.payload , quantity : 1 })
           }

           state.count +=1
        },
        deleteCart(state , action){
          const deleteItem = state.items.find((i)=> i.id == action.payload)

          if(deleteItem){
            deleteItem.quantity -=1

            if(deleteItem.quantity <= 0){
                state.items = state.items.filter((item)=> item.id !== action.payload)
            }
          }
           state.count -=1
        }
    }
})

export const {addCart , deleteCart} = cartReducer.actions

export default cartReducer.reducer