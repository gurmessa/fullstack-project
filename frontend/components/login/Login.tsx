import React, { useState } from 'react'
import { Alert, Button, Card, Form, Input } from 'antd'
import { loginUser } from 'store/user/userThunks'
import { useReduxDispatch } from 'store/store'

export const Login = () => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useReduxDispatch()

  const onFinish = async ({ username, password }: { username: string; password: string }) => {
    setError('')
    setIsLoading(true)
    try {
      await dispatch(loginUser({ username, password }))
      window.location.href = '/platform/'
    } catch (ex) {
      // On production, we would provide much more insight here.
      setError('Your username or password is incorrect.')
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <Form name="basic" onFinish={onFinish} labelCol={{ span: 8 }}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
        {error && <Alert message={error} type="error" />}
      </Form>
    </Card>
  )
}
