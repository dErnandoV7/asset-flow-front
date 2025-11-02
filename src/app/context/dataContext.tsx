"use client"

import { useReducer, createContext, ReactNode, useContext } from "react";
import { AssetIdentity } from "../types/assetType";

type Action = { type: "SET_ASSETS_IDENTITY", payload: any }

interface State {
    assetsIdentity: AssetIdentity[] | null
}

const initialState: State = {
    assetsIdentity: null
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_ASSETS_IDENTITY":
            return {
                ...state,
                assetsIdentity: action.payload
            }
    }
}

const AppContext = createContext<
    {
        state: State,
        dispatch: React.Dispatch<Action>
    } | undefined
>(undefined)


export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)

    if (!context) throw new Error("useAppContext deve ser usado dentro de <AppProvider>");

    return context
}