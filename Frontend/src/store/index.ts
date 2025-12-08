import { useCallback } from "react"
import { configureStore } from "@reduxjs/toolkit"
import { slice } from "./slice"
import { useDispatch, useSelector } from "react-redux"
import type { User } from "@/interface/User"

const { actionSetToken, actionRemoveToken, actionSetUser, actionRemoveUser } = slice.actions

export const store = configureStore({
    reducer: {stores: slice.reducer}
})

type AppDispatchType = typeof store.dispatch
type SelectorType = ReturnType<typeof store.getState>
type StateType = ReturnType<typeof slice.getInitialState>

export const useStore = () => {
    const { token, user } = useSelector<SelectorType, StateType>(state => state.stores)
    const dispatch = useDispatch<AppDispatchType>()

    const setToken = useCallback((token: string) => dispatch(actionSetToken(token)), [])
    const removeToken = useCallback(() => dispatch(actionRemoveToken()), [])
    const setUser = useCallback((user: User) => dispatch(actionSetUser(user)), [])
    const removeUser = useCallback(() => dispatch(actionRemoveUser()), [])

    return {token, user, setToken, removeToken, setUser, removeUser}
}