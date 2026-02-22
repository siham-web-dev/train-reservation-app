"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Form, Input, Select, Button, Switch, Divider, Avatar, Upload, List, Tag, message, Spin } from 'antd';
import { UploadOutlined, CreditCardOutlined, UserOutlined, QuestionCircleOutlined, MessageOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { getUserProfile, updateProfile } from '@/app/actions/auth';
import { getStationSubscription } from '@/app/actions/billing';
import { createSupportTicket } from '@/app/actions/support';

const { Title, Text } = Typography;
const { Option } = Select;

export default function StationOwnerSettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        async function loadData() {
            const profileRes = await getUserProfile();
            if (profileRes.data) {
                setProfile(profileRes.data);
                if (profileRes.data.station_id) {
                    const subRes = await getStationSubscription(profileRes.data.station_id);
                    if (!('error' in subRes)) {
                        setSubscription(subRes.data);
                    }
                }
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleSupportSubmit = async (values: any) => {
        setSubmitting(true);
        const res = await createSupportTicket(values);
        setSubmitting(false);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Support ticket submitted successfully!');
            form.resetFields();
        }
    };

    const handleProfileSubmit = async (values: any) => {
        setSubmitting(true);
        const res = await updateProfile(values);
        setSubmitting(false);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Profile updated successfully!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <Title level={2} className="!m-0 text-gray-800">Station Settings</Title>
                <Text type="secondary">Manage your station profile, preferences, and billing</Text>
            </div>

            <div className="bg-white p-2 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: 'Profile',
                            children: (
                                <div className="p-4 max-w-2xl">
                                    <div className="flex items-center gap-6 mb-8">
                                        <Avatar size={100} icon={<UserOutlined />} src={profile?.avatar_url} />
                                        <div>
                                            <Button icon={<UploadOutlined />} className="mb-2">Change Picture</Button>
                                            <div className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</div>
                                        </div>
                                    </div>

                                    <Form layout="vertical" onFinish={handleProfileSubmit} initialValues={{
                                        name: profile?.name,
                                        email: profile?.email,
                                        phone: profile?.phone,
                                        address: profile?.station?.location
                                    }}>
                                        <Form.Item label="Station Manager Name" name="name" required rules={[{ required: true, message: 'Please enter your name' }]}>
                                            <Input size="large" />
                                        </Form.Item>
                                        <Form.Item label="Email Address" name="email">
                                            <Input size="large" disabled />
                                        </Form.Item>
                                        <Form.Item label="Phone Number" name="phone">
                                            <Input size="large" />
                                        </Form.Item>
                                        <Form.Item label="Station Address" name="address">
                                            <Input.TextArea rows={3} />
                                        </Form.Item>
                                        <Button type="primary" size="large" className="mt-4" htmlType="submit" loading={submitting}>Save Changes</Button>
                                    </Form>
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: 'Timezone',
                            children: (
                                <div className="p-4 max-w-2xl">
                                    <Title level={4}>Date & Time Settings</Title>
                                    <Text type="secondary" className="block mb-6">Select your local timezone to ensure schedules are perfectly aligned.</Text>

                                    <Form layout="vertical">
                                        <Form.Item label="Timezone">
                                            <Select defaultValue="america_new_york" size="large">
                                                <Option value="america_new_york">(UTC-05:00) Eastern Time (US & Canada)</Option>
                                                <Option value="america_chicago">(UTC-06:00) Central Time (US & Canada)</Option>
                                                <Option value="america_denver">(UTC-07:00) Mountain Time (US & Canada)</Option>
                                                <Option value="america_los_angeles">(UTC-08:00) Pacific Time (US & Canada)</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Time Format">
                                            <Select defaultValue="24h" size="large">
                                                <Option value="12h">12-hour (1:00 PM)</Option>
                                                <Option value="24h">24-hour (13:00)</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Auto-adjust for Daylight Saving Time">
                                            <Switch defaultChecked />
                                        </Form.Item>
                                        <Button type="primary" size="large" className="mt-4">Update Preferences</Button>
                                    </Form>
                                </div>
                            ),
                        },
                        {
                            key: '4',
                            label: 'Billing',
                            children: (
                                <div className="p-4">
                                    <Title level={4}>Subscription & Payment</Title>
                                    {subscription ? (
                                        <div className="mb-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100 max-w-3xl">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Title level={5} className="!text-blue-800 !m-0 capitalize">{subscription.plan_type} Plan</Title>
                                                    <Tag color="green" className="mt-2">Active</Tag>
                                                    <Text type="secondary" className="text-xs block mt-2">Started on: {new Date(subscription.created_at).toLocaleDateString()}</Text>
                                                </div>
                                                <Button>Manage Subscription</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 max-w-3xl">
                                            <Text type="secondary">No active subscription found.</Text>
                                            <Button type="primary" className="block mt-4">Choose a Plan</Button>
                                        </div>
                                    )}

                                    <Title level={5} className="mt-8 mb-4">Payment Methods</Title>
                                    <div className="max-w-3xl">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={[
                                                { title: 'Visa ending in 4242', description: 'Expires 12/2024', isDefault: true }
                                            ]}
                                            className="border border-gray-200 rounded-lg mb-4"
                                            renderItem={(item) => (
                                                <List.Item
                                                    actions={[
                                                        !item.isDefault && <Button type="link" key="make-default">Make Default</Button>,
                                                        <Button type="text" danger key="remove">Remove</Button>
                                                    ]}
                                                    className="px-4"
                                                >
                                                    <List.Item.Meta
                                                        avatar={<div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200"><CreditCardOutlined /></div>}
                                                        title={
                                                            <div className="flex items-center gap-2">
                                                                {item.title}
                                                                {item.isDefault && <Tag color="blue" className="ml-2">Default</Tag>}
                                                            </div>
                                                        }
                                                        description={item.description}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                        <Button icon={<PlusOutlined />} type="dashed" block className="h-12 !border-gray-300">
                                            Add New Payment Method
                                        </Button>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: '5',
                            label: 'Support',
                            children: (
                                <div className="p-4 max-w-2xl">
                                    <Title level={4}>Help & Support</Title>
                                    <Text type="secondary" className="block mb-6">Get help with your station portal and manage support requests.</Text>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-start gap-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg flex-shrink-0">
                                                <FileTextOutlined />
                                            </div>
                                            <div>
                                                <Text strong className="block mb-1">Documentation</Text>
                                                <Text type="secondary" className="text-sm">Read guides and tutorials on how to use the portal effectively.</Text>
                                            </div>
                                        </div>
                                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-start gap-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg flex-shrink-0">
                                                <QuestionCircleOutlined />
                                            </div>
                                            <div>
                                                <Text strong className="block mb-1">FAQs</Text>
                                                <Text type="secondary" className="text-sm">Find answers to commonly asked questions from other station owners.</Text>
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    <Title level={5} className="mb-4">Contact Support</Title>
                                    <Form form={form} layout="vertical" onFinish={handleSupportSubmit}>
                                        <Form.Item label="Subject" name="subject" required rules={[{ required: true, message: 'Please enter a subject' }]}>
                                            <Input placeholder="E.g., Issue with billing" size="large" />
                                        </Form.Item>
                                        <Form.Item label="Message" name="message" required rules={[{ required: true, message: 'Please enter your message' }]}>
                                            <Input.TextArea placeholder="Describe your issue in detail..." rows={5} />
                                        </Form.Item>
                                        <Button type="primary" size="large" icon={<MessageOutlined />} htmlType="submit" loading={submitting}>
                                            Submit Support Ticket
                                        </Button>
                                    </Form>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}
