import React, { useEffect, useState } from 'react'
import { Collapse } from 'antd';
import { Col, Row } from 'antd';
import { Essay } from 'store/feedbackDetail/feedbackDetailTypes';
import { Divider, Radio, Typography } from 'antd';

import { Input, Card } from 'antd';

const { Paragraph } = Typography;
const { TextArea } = Input;

const content = "hello World"

export const AddFeedback = ({ essay, setComment }) => {


  return (
    <Card style={{ margin: 10 }}>
    <Row>
        <Col span={12} style={{ padding: 10 }}>
            <Typography.Title level={3} >
                Essay
            </Typography.Title>
            <p>{ essay.content }</p>
        </Col>
            <Col span={12} style={{ padding: 10 }}>
                <Typography.Title level={3} >
                    Your Feedback
                </Typography.Title>
                <TextArea rows={4} placeholder="Placeholder"
                    onChange={(e)=>{ setComment(e.target.value)}}
                />
            </Col>
    </Row>
    </Card>



  );

}