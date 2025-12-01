import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction} from "@reduxjs/toolkit";


type Users = {
    userName: string,
    email: string,
    password: string,
}

type initial = {
    credentials: Users[],
    isLogin: boolean
}

const storedUsers: Users[] = JSON.parse(localStorage.getItem("users") || "[]");
const storedLogin: boolean = JSON.parse(localStorage.getItem("isLogin") || "false")

const initialState: initial = {
    credentials: storedUsers,
    isLogin: storedLogin
}

const authReducer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<Users>) {

            state.credentials.push(action.payload)

            localStorage.setItem("users", JSON.stringify(state.credentials))
        },
        login(state, action:PayloadAction<{ email: string; password: string }>) {
            const { email, password } = action.payload

            let users = state.credentials.find((user) => {
                return user.email === email && user.password === password
            })

            if (users) {
                state.isLogin = true
                localStorage.setItem("isLogin", JSON.stringify(true))
            } else {
                state.isLogin = false
                localStorage.setItem("isLogin", JSON.stringify(false))
            }
        },
        logout(state) {
            state.isLogin = false
            localStorage.setItem("isLogin", JSON.stringify(false))
        }
    }
})

export const { addUser, login, logout } = authReducer.actions

export default authReducer.reducer

