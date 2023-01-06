import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { map, zipObject } from 'lodash'
import { Essay, Feedback, FeedbackRequest, FeedbackDetailState } from './feedbackDetailTypes'

const initialState: FeedbackDetailState = {
  currentFeedbackRequest: null,
  perviousEssays: [],
}

const previousFeedbackState = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /*setCurrentFeedbackRequest(state, action: PayloadAction<FeedbackRequest>) {
        console.log('action.payload')
        console.log(action.payload)
        state.currentFeedbackRequest = action.payload
    },*/

    addPreviousFeedbackStateFeedbacks(state, action: PayloadAction<Essay[]>) {
      state.perviousEssays = action.payload
    },
  },
})

export const { setCurrentFeedbackRequest, addPreviousFeedbackStateFeedbacks } = previousFeedbackState.actions
export default previousFeedbackState.reducer
