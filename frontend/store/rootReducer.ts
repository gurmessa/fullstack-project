import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import feedbackReducer from './feedback/feedbackSlice'

const rootReducer = combineReducers({
  user: userReducer,
  feedback: feedbackReducer,
})
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
