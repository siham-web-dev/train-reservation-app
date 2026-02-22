"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Input, Button, Avatar, Space, Spin, Modal, Form, message } from 'antd';
import { SearchOutlined, UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { getUserProfile } from '@/app/actions/auth';
import { getDrivers, createDriver } from '@/app/actions/drivers';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Driver Details',
        dataIndex: 'driver',
        key: 'driver',
        render: (text: string, record: any) => (
            <div className="flex items-center gap-3">
                <Avatar src={record.avatar} icon={<UserOutlined />} size="large" />
                <div>
                    <Text strong className="block">{text}</Text>
                    <Text type="secondary" className="text-xs">{record.id}</Text>
                </div>
            </div>
        ),
    },
    {
        title: 'Contact Info',
        key: 'contact',
        render: (text: string, record: any) => (
            <div className="text-sm">
                <div className="flex items-center gap-2 mb-1"><MailOutlined className="text-gray-400" /> {record.email}</div>
                <div className="flex items-center gap-2"><PhoneOutlined className="text-gray-400" /> {record.phone}</div>
            </div>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'On Duty' ? 'success' : status === 'Off Duty' ? 'default' : 'warning'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Assigned Train',
        dataIndex: 'train',
        key: 'train',
        render: (text: string) => <Text className={text ? '' : 'text-gray-400 italic'}>{text || 'Unassigned'}</Text>
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space>
                <Button type="link">View Schedule</Button>
            </Space>
        ),
    },
];

export default function StationOwnerDriversPage() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [stationId, setStationId] = useState<number | null>(null);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        const profileRes = await getUserProfile();
        if (profileRes.data?.station_id) {
            setStationId(profileRes.data.station_id);
            const driversRes = await getDrivers(profileRes.data.station_id);
            if (!('error' in driversRes)) {
                setDrivers(driversRes.data);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateDriver = async (values: any) => {
        if (!stationId) return;
        setSubmitting(true);
        const res = await createDriver(stationId, values);
        setSubmitting(false);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Driver hired successfully!');
            setIsModalVisible(false);
            form.resetFields();
            loadData();
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Drivers Roster</Title>
                    <Text type="secondary">Manage train drivers and their schedules</Text>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Input
                        placeholder="Find driver..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-lg w-full sm:w-56"
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="rounded-lg shadow-md shadow-blue-500/20"
                        onClick={() => setIsModalVisible(true)}
                    >
                        Hire Driver
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="mb-4">
                    <Space wrap>
                        <Tag color="blue" className="cursor-pointer text-sm py-1 px-3">All Drivers ({drivers.length})</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 block"></span> On Duty ({drivers.filter(d => d.status === 'On Duty').length})</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 block"></span> Off Duty ({drivers.filter(d => d.status === 'Off Duty').length})</Tag>
                    </Space>
                </div>
                <Table columns={columns} dataSource={drivers} />
            </div>

            <Modal
                title="Hire New Driver"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateDriver}>
                    <Form.Item label="Full Name" name="name" required rules={[{ required: true, message: 'Please enter driver name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" required rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="License Number" name="license_number">
                        <Input />
                    </Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Hire Driver</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
