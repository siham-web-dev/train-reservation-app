"use client";

import React from 'react';
import { Typography, Table, Input, Button, Tag, Avatar } from 'antd';
import { SearchOutlined, DownloadOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Passenger Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any) => (
            <div className="flex items-center gap-3">
                <Avatar src={record.avatar} icon={<UserOutlined />} />
                <Text strong>{text}</Text>
            </div>
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
        title: 'Frequent Route',
        dataIndex: 'route',
        key: 'route',
    },
    {
        title: 'Total Trips',
        dataIndex: 'trips',
        key: 'trips',
        sorter: (a: any, b: any) => a.trips - b.trips,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'Emma Watson',
        email: 'emma.w@example.com',
        route: 'Central -> North Junction',
        trips: 42,
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    },
    {
        key: '2',
        name: 'Liam Neeson',
        email: 'liam.n@example.com',
        route: 'Eastside -> Central',
        trips: 15,
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam'
    },
    {
        key: '3',
        name: 'Olivia Pope',
        email: 'olivia.p@example.com',
        route: 'Central -> West Park',
        trips: 3,
        status: 'Inactive',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia'
    },
];

export default function StationOwnerPassengersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Passenger Directory</Title>
                    <Text type="secondary">View passenger history and statistics</Text>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Input
                        placeholder="Search passengers by name or email..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-lg w-full sm:w-72"
                    />
                    <Button icon={<DownloadOutlined />} className="rounded-lg shadow-sm">
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}
