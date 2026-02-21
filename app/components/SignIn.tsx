import { Button, Form, Input, Modal } from "antd"

const SignIn = ({ isSignInModalVisible, setIsSignInModalVisible }: {
    isSignInModalVisible: boolean;
    setIsSignInModalVisible: (value: boolean) => void;
}) => {
    return (
        < Modal
            title="Sign In"
            open={isSignInModalVisible}
            onCancel={() => setIsSignInModalVisible(false)}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" size="large">
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </Modal >

    )
}

export default SignIn