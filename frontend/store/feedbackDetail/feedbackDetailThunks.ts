import { Dispatch } from '@reduxjs/toolkit'
import API from 'store/api'
import { Urls } from 'store/urls'
import { setCurrentFeedbackRequestId } from 'apps/utils/utils'
import { FeedbackRequest } from './feedbackDetailTypes'
import { setCurrentFeedbackRequest, addPreviousFeedbackStateFeedbacks } from './feedbackDetailSlice'
import { removeCurrentFeedbackRequestId } from 'apps/utils/utils'

const getEssays = (essay: Essay, essayList: Essay[]) => {
  if(essay.revision_of){
    return getEssays(essay.revision_of, [...essayList, essay as Essay])
  }
  return [...essayList, essay as Essay]
  
}
export const loadFeedbackRequestDetails = (feedbackRequestId: string) => async (dispatch: Dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data: feedbackRequest }: { data: any } = await API.get(Urls.FeedbackRequestDetail(feedbackRequestId))
    const currentFeedbackRequest = feedbackRequest as FeedbackRequest
    const previousEssays = getEssays(currentFeedbackRequest.essay, [])

    dispatch(addPreviousFeedbackStateFeedbacks(previousEssays))
  } catch (err) {
    throw err
  }
}


export const returnFeedback = (feedbackRequestId: string, comment: string) => async (dispatch: Dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data: feedbackRequest }: { data: any } = await API.put(Urls.ReturnFeedback(feedbackRequestId), {comment});
    removeCurrentFeedbackRequestId()
  } catch (err) {
    throw err
  }
}

export const pickupFeedbackRequest = (feedbackRequestId: string) => async (dispatch: Dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data: feedbackRequest }: { data: any } = await API.post(Urls.PickupFeedbackRequest(), {feedback_request: feedbackRequestId})
    setCurrentFeedbackRequestId(feedbackRequestId)
  } catch (err) {
    throw err
  }
}
