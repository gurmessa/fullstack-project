import { Card, List, message, PageHeader, Spin, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getEssays, selectOrderedFeedbackRequests } from 'store/feedback/feedbackSelector'
import { loadFeedbackRequests } from 'store/feedback/feedbackThunks'
import { loadFeedbackRequestDetails } from 'store/feedbackDetail/feedbackDetailThunks'
import { FeedbackRequest } from 'store/feedback/feedbackTypes'
import { returnFeedback } from 'store/feedbackDetail/feedbackDetailThunks'
import { useReduxDispatch } from 'store/store'
import { useParams } from "react-router-dom";
import { getPreviousEssays } from 'store/feedbackDetail/feedbackDetailSelector'
import { getCurrentFeedbackRequest } from 'store/feedbackDetail/feedbackDetailSelector'
import { PreviousFeedbackList } from './PreviousEssayList'
import { AddFeedback } from './AddFeedback'
import { getCurrentFeedbackRequestId } from 'apps/utils/utils'
import { pickupFeedbackRequest } from 'store/feedbackDetail/feedbackDetailThunks'
import { useHistory } from "react-router-dom";

export const FeedbackDetail = () => {
  const history = useHistory()

  const [submitBtnClicked, setSubmitBtnClicked] = useState(false)

  const [comment, setComment] = useState("comment")
  
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useReduxDispatch()
  const feedbackRequests = useSelector(selectOrderedFeedbackRequests)
  const essays = useSelector(getEssays)

  let { id } = useParams<{ tokenName: string }>();

  const previousEssays = useSelector(getPreviousEssays)
  
  useEffect(() => {
   (async () => {
    
    if(submitBtnClicked){
      try{
        await dispatch(returnFeedback(id, comment))
        history.push(`/`)
      } catch (err) {
        setIsLoading(false)
        message.error('Failed to save feedback')
        console.log(err)
      }
    }
      
    })()
  }, [submitBtnClicked])
 


  useEffect(() => {
    ; (async () => {

      let current_feedback_request_id = getCurrentFeedbackRequestId()
      console.log("current_feedback_request_id ", current_feedback_request_id)      

      setIsLoading(true)

      if(current_feedback_request_id == null) {
        try {
          await dispatch(pickupFeedbackRequest(id))
          await dispatch(loadFeedbackRequestDetails(id))
          setIsLoading(false)

        } catch (err) {
          setIsLoading(false)
          message.error('Failed to load feedback request detail')
          console.log(err)
        }
      }else {
        try {
          await dispatch(loadFeedbackRequestDetails(id))
          setIsLoading(false)
  
        } catch (err) {
          setIsLoading(false)
          message.error('Failed to load feedback request detail')
          console.log(err)
        }
      }




    })()
  }, [dispatch])

  const filterPreviousFeedbackList = () => {
    return previousEssays.filter((essay,index) => {
      if(index===0){
        return false;
      }else{
        return true;
      }
    })

  }
  const getCurrentFeedbackList = () => {
    if(previousEssays.length > 0){
      previousEssays[0]
    }
    return null
  }


  const getCurrentFeedbackRequest = () => {
    if(previousEssays.length > 0) {
      return previousEssays[0]
    }
    return null
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card className="center">
          <Spin />
        </Card>
      )
    }
    return (
      <>
      {previousEssays.length > 0?
      <>
      <PreviousFeedbackList essays={filterPreviousFeedbackList()}/>
          <AddFeedback 
          comment={comment}
          setComment={setComment}
          essay={getCurrentFeedbackRequest()}
          />       
      </>
      :""

      }

      </>
    )
  }

  return (
    <>
      <PageHeader ghost={false} title={previousEssays.length > 0? getCurrentFeedbackRequest().name :''} 
      extra={[
        <Button key="1" type="primary"
          onClick={(e)=>{setSubmitBtnClicked(true)}}
        >
          Submit Feedback
        </Button>
      ]}
      />
        
      <Card>{renderContent()}</Card>

    </>
  )

}
