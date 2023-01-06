import { Card, List, message, PageHeader, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getEssays, selectOrderedFeedbackRequests } from 'store/feedback/feedbackSelector'
import { loadFeedbackRequests } from 'store/feedback/feedbackThunks'
import { FeedbackRequest } from 'store/feedback/feedbackTypes'
import { useReduxDispatch } from 'store/store'
import { useHistory } from "react-router-dom";
import { getCurrentFeedbackRequestId } from 'apps/utils/utils'

export const EssayList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useReduxDispatch()
  const feedbackRequests = useSelector(selectOrderedFeedbackRequests)
  const essays = useSelector(getEssays)
  const history = useHistory()

  const handleClick = (id: string) => {
    history.push(`/feedback/${id}`)
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        await dispatch(loadFeedbackRequests())
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        message.error('Failed to load essays. Please refresh this page to try again.')
      }
    })()
  }, [dispatch])

  useEffect(() => {
    let current_feedback_request_id = getCurrentFeedbackRequestId();
    if(current_feedback_request_id){
      history.push(`/feedback/${current_feedback_request_id}`)
    }
    
  })
  const renderContent = () => {
    
    
    if (isLoading) {
      return (
        <Card className="center">
          <Spin />
        </Card>
      )
    }
    return (
      <List
        itemLayout="horizontal"
        dataSource={feedbackRequests}
        renderItem={(item: FeedbackRequest) => {
          const essay = essays[item.essay]

          return (
            <List.Item
              actions={[<a key="list-loadmore-edit" onClick={() => { handleClick(item.pk) }}>edit</a>]}
            >
              <List.Item.Meta title={essay.name} />
              
            </List.Item>
          )
        }} />
    )
  }

  return (
    <>
      <PageHeader ghost={false} title="Feedback Requests" />
      <Card>{renderContent()}</Card>
    </>
  )

}
