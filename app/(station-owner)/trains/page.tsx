"use client";

import React from 'react';
import { Typography, Table, Button, Space, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Train Name/ID',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <Text strong>{text}</Text>,
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Capacity',
        dataIndex: 'capacity',
        key: 'capacity',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'Operational' ? 'success' : status === 'In Transit' ? 'processing' : 'warning'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Current Route',
        dataIndex: 'route',
        key: 'route',
        render: (text: string) => <Text className="text-gray-500">{text}</Text>,
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button type="text" icon={<EditOutlined className="text-blue-500" />}>Edit</Button>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'T-Express 401',
        type: 'High Speed',
        capacity: 450,
        status: 'Operational',
        route: 'Central -> North Junction',
    },
    {
        key: '2',
        name: 'Commuter Line A',
        type: 'Regional',
        capacity: 320,
        status: 'In Transit',
        route: 'Eastside -> Central',
    },
    {
        key: '3',
        name: 'Cargo Mover 99',
        type: 'Freight',
        capacity: 'N/A',
        status: 'Maintenance',
        route: 'Depot',
    },
];

export default function StationOwnerTrainsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Fleet Management</Title>
                    <Text type="secondary">Manage your trains and their statuses</Text>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Input
                        placeholder="Search trains..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-lg w-full sm:w-64"
                    />
                    <Button type="primary" icon={<PlusOutlined />} className="rounded-lg shadow-md shadow-blue-500/20">
                        Add Train
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}
