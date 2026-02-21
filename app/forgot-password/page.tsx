"use client"

import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { resetPassword } from '../actions/auth'

const { Title, Text } = Typography

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const onFinish = async (values: { email: string }) => {
        setLoading(true)
        try {
            const result = await resetPassword(values.email)
            if (result.error) {
                message.error(result.error)
            } else {
                setSubmitted(true)
                message.success('Password reset email sent!')
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
                    <Title level={2} className="!mb-2">Forgot Password</Title>
                    <Text type="secondary">
                        {submitted
                            ? "Check your email for the reset link"
                            : "Enter your email to receive a password reset link"}
                    </Text>
                </div>

                {!submitted ? (
                    <Form
                        name="forgot-password"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Email Address"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item className="mb-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full h-12 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700"
                            >
                                Send Reset Link
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                                <ArrowLeftOutlined className="mr-2" />
                                Back to Sign In
                            </Link>
                        </div>
                    </Form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <Text className="text-green-700 block">
                                We've sent an email to your address with instructions on how to reset your password.
                            </Text>
                        </div>
                        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <ArrowLeftOutlined className="mr-2" />
                            Return to Login
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    )
}
