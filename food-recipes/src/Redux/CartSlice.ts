import { createSlice } from "@reduxjs/toolkit";
import type { Recipe } from "./RecipesSlice";


export type CartItem = Recipe & {quantity : number}

type initial = {
    items : CartItem[]
}

const MyCartItem : CartItem[] = JSON.parse(localStorage.getItem("CartDetails") || "[]")

const initialState: initial = {
    items : MyCartItem
} 

const cartSlice = createSlice({
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

           localStorage.setItem("CartDetails" , JSON.stringify(state.items))
        },
        deleteCart(state , action){
          const deleteItem = state.items.find((i)=> i.id == action.payload)

          if(deleteItem){
            deleteItem.quantity -=1
  
            if(deleteItem.quantity <= 0){
                state.items = state.items.filter((item)=> item.id !== action.payload)
                
            }
          }

          localStorage.setItem("CartDetails" , JSON.stringify(state.items))
        }
    }
})

export const {addCart , deleteCart} = cartSlice.actions

export default cartSlice.reducer