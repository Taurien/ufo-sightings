import { configureStore } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import mapReducer from './slices/mapSlice'

const reduxStore = () => configureStore({
  reducer: {
    map: mapReducer,
  },
  devTools: process.env.NEXT_PUBLIC_ENVIRONMENT && true,
})

export const reduxWrapper = createWrapper(reduxStore)

