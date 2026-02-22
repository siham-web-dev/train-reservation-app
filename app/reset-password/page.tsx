"use client"

import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updatePassword } from '../actions/auth'

const { Title, Text } = Typography

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const result = await updatePassword(values.password)
            if (result.error) {
                message.error(result.error)
            } else {
                message.success('Password updated successfully!')
                router.push('/')
            }
        } catch (error: any) {
            message.error(error.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg rounded-xl">
                <div className="text-center mb-8">
                    <Title level={2} className="!mb-2">Reset Password</Title>
                    <Text type="secondary">
                        Enter your new password below
                    </Text>
                </div>

                <Form
                    name="reset-password"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="New Password"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm Password"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-12 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700"
                        >
                            Reset Password
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-6">
                        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <ArrowLeftOutlined className="mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
