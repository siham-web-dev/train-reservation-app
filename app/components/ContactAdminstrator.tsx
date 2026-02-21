import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd"

const ContactAdminstrator = ({ isContactModalVisible, setIsContactModalVisible }: {
    isContactModalVisible: boolean;
    setIsContactModalVisible: (value: boolean) => void;
}) => {
    return (

        <>
            {/* Contact Administrator Modal */}
            <Modal
                title="Contact Administrator"
                open={isContactModalVisible}
                onCancel={() => setIsContactModalVisible(false)}
                footer={null}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto',
                        paddingRight: '8px'
                    }
                }}
            >
                <Form layout="vertical">
                    <Form.Item label="Full name" name="fullName" rules={[{ required: true, message: 'Please input your name!' }]}>
                        <Input placeholder="Enter your full name" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                        <Input placeholder="Enter your phone number" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item label="Station name" name="stationName" rules={[{ required: true, message: 'Please input your station name!' }]}>
                        <Input placeholder="Enter your station name" />
                    </Form.Item>
                    <Form.Item label="Number of trains" name="numberOfTrains" rules={[{ required: true, message: 'Please input your number of trains!' }]}>
                        {/* select */}
                        <Select
                            placeholder="Select number of trains"
                            options={[
                                { value: '1 - 10 train', label: '1 - 10 train' },
                                { value: '11 - 20 train', label: '11 - 20 train' },
                                { value: '21 - 30 train', label: '21 - 30 train' },
                                { value: '31 - 40 train', label: '31 - 40 train' },
                                { value: '41 - 50 train', label: '41 - 50 train' },
                                { value: '51 - 60 train', label: '51 - 60 train' },
                                { value: '61 - 70 train', label: '61 - 70 train' },
                                { value: '71 - 80 train', label: '71 - 80 train' },
                                { value: '81 - 90 train', label: '81 - 90 train' },
                                { value: '91 - 100 train', label: '91 - 100 train' },
                                { value: '>= 100 train', label: '>= 100 train' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Upload Logo" valuePropName="fileList">
                        <Upload.Dragger name="file" multiple={false} listType="picture" beforeUpload={() => false}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item label="Notes" name="Notes" rules={[{ required: true, message: 'Please input your message!' }]}>
                        <Input.TextArea rows={4} placeholder="How can we help you?" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" size="large">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>)
}

export default ContactAdminstrator