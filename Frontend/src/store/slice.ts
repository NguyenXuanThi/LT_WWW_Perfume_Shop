import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type User } from "@/interface/User"

export const slice = createSlice({
    name: "stores",
    initialState: {token: "", user: undefined as undefined | User},
    reducers: {
        actionSetToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        actionRemoveToken: (state) => {
            state.token = ""
        },
        actionSetUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        actionRemoveUser: (state) => {
            state.user = undefined
        }
    }
})