import { createSelector } from "@reduxjs/toolkit";
import { sortBy, values } from "lodash";
import { RootState } from "store/rootReducer";

export const getEssays = (state: RootState) => state.feedback.essays
export const getFeedbackRequests = (state: RootState) => state.feedback.feedbackRequests

export const selectOrderedFeedbackRequests = createSelector(getFeedbackRequests, feedbackRequests =>
  sortBy(values(feedbackRequests), ['deadline', 'name']),
)
