import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import feedbackReducer from './feedback/feedbackSlice'
import feedbackDetailReducer from './feedbackDetail/feedbackDetailSlice'

const rootReducer = combineReducers({
  user: userReducer,
  feedback: feedbackReducer,
  feedbackDetail: feedbackDetailReducer,
})
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
