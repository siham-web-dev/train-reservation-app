"use client";

import { Button, Form, Input, Modal, message } from "antd"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../actions/auth";
import Link from "next/link";

const SignIn = ({ isSignInModalVisible, setIsSignInModalVisible }: {
    isSignInModalVisible: boolean;
    setIsSignInModalVisible: (value: boolean) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const result = await signIn(values);

            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Logged in successfully!");
                setIsSignInModalVisible(false);

                if (result.role === 'admin') {
                    router.push("/admin/analytics");
                } else {
                    router.push("/analytics");
                }
            }
        } catch (error: any) {
            message.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<div className="text-2xl font-bold text-center mt-4">Sign In</div>}
            open={isSignInModalVisible}
            onCancel={() => setIsSignInModalVisible(false)}
            footer={null}
            centered
            width={400}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={onFinish} className="mt-6">
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                    <Input placeholder="Enter your email" size="large" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
                >
                    <Input.Password placeholder="Enter your password" size="large" />
                </Form.Item>

                <div className="flex justify-end mb-4">
                    <Link href="/forgot-password" onClick={() => setIsSignInModalVisible(false)} className="text-sm text-blue-600 hover:text-blue-800">
                        Forgot Password?
                    </Link>
                </div>

                <Form.Item className="mb-0">
                    <Button type="primary" htmlType="submit" className="w-full h-12 text-base font-semibold rounded-lg" loading={loading}>
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default SignIn