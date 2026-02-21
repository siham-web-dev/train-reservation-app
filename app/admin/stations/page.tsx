"use client";

import React from 'react';
import { Typography, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Station Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <Text strong>{text}</Text>,
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'Active' ? 'success' : 'error'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Platforms',
        dataIndex: 'platforms',
        key: 'platforms',
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button type="text" icon={<EditOutlined className="text-blue-500" />} />
                <Button type="text" danger icon={<DeleteOutlined />} />
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'Central Station',
        city: 'Metropolis',
        status: 'Active',
        platforms: 12,
    },
    {
        key: '2',
        name: 'North Junction',
        city: 'Gotham',
        status: 'Maintenance',
        platforms: 8,
    },
    {
        key: '3',
        name: 'Eastside Terminal',
        city: 'Star City',
        status: 'Active',
        platforms: 5,
    },
];

export default function AdminStationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Stations Management</Title>
                    <Text type="secondary">Manage all railway stations in the network</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" className="rounded-lg shadow-md shadow-blue-500/20">
                    Add Station
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}
