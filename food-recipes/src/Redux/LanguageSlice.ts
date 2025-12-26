import { createSlice } from "@reduxjs/toolkit"

type LangugaeState = {
    lang : string
}  

const initialState:LangugaeState = {
    lang : "en"
}

const languageSlice = createSlice({
    name:"language", 
    initialState,
    reducers:{
        setLanguage(state , action){
            state.lang = action.payload
        }
    }
})

export const {setLanguage} = languageSlice.actions
export default languageSlice.reducer