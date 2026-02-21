"use client";

import React from 'react';
import { Typography, Table, Tag, Input, Button, Avatar, Space } from 'antd';
import { SearchOutlined, UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';

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

const data = [
    {
        key: '1',
        id: 'DRV-1029',
        driver: 'Michael Scott',
        email: 'michael.s@example.com',
        phone: '+1 555-0192',
        status: 'On Duty',
        train: 'T-Express 401',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
        key: '2',
        id: 'DRV-1030',
        driver: 'Dwight Schrute',
        email: 'dwight.s@example.com',
        phone: '+1 555-0193',
        status: 'Off Duty',
        train: null,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dwight'
    },
    {
        key: '3',
        id: 'DRV-1031',
        driver: 'Jim Halpert',
        email: 'jim.h@example.com',
        phone: '+1 555-0194',
        status: 'On Leave',
        train: null,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jim'
    },
];

export default function StationOwnerDriversPage() {
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
                    <Button type="primary" icon={<PlusOutlined />} className="rounded-lg shadow-md shadow-blue-500/20">
                        Hire Driver
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="mb-4">
                    <Space wrap>
                        <Tag color="blue" className="cursor-pointer text-sm py-1 px-3">All Drivers (45)</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 block"></span> On Duty (12)</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 block"></span> Off Duty (30)</Tag>
                    </Space>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}
