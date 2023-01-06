import React, { useEffect, useState } from 'react'
import { Collapse } from 'antd';
import { Col, Row } from 'antd';
import { Essay } from 'store/feedbackDetail/feedbackDetailTypes';
import { Divider, Radio, Typography } from 'antd';
const { Paragraph } = Typography;

const { Panel } = Collapse


export const PreviousFeedbackList = ({ essays }) => {
  const onChange = (key: string | string[]) => {
    console.log(key)
  }

  return (
    <Collapse defaultActiveKey={['0']} onChange={onChange} style={{ margin: 10 }}>
    {
    essays.map((essay: Essay, index: number) => {
        return <Panel header={ essay.name } key={index}>
            <Row>
                <Col span={12} style={{ padding: 10 }}>
                    <Typography.Title level={3} >
                        Essay
                    </Typography.Title>
                    <p>{ essay.content }</p>
                </Col>
                    <Col span={12} style={{ padding: 10 }}>
                        <Typography.Title level={3} style={{ padding: 10 }}>
                            Feedback
                        </Typography.Title>
                        <p>{ essay.feedback.comment }</p>
                    </Col>
                </Row>
                </Panel>        
            })
        }
     
    </Collapse>
        


  );

}