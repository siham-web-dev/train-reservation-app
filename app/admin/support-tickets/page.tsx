"use client";

import React from 'react';
import { Typography, Table, Tag, Input, Space, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Ticket ID',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <Text strong className="text-blue-600">#{text}</Text>,
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            let color = 'default';
            if (status === 'Open') color = 'processing';
            if (status === 'In Progress') color = 'warning';
            if (status === 'Resolved') color = 'success';
            return <Tag color={color}>{status}</Tag>;
        },
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Button type="text" icon={<EyeOutlined className="text-gray-500" />}>
                View Details
            </Button>
        ),
    },
];

const data = [
    {
        key: '1',
        id: '1042',
        user: 'johndoe@example.com',
        subject: 'Cannot book a ticket',
        status: 'Open',
        date: '2023-10-24 10:30 AM',
    },
    {
        key: '2',
        id: '1043',
        user: 'sarah.smith@example.com',
        subject: 'Refund request',
        status: 'In Progress',
        date: '2023-10-23 04:15 PM',
    },
    {
        key: '3',
        id: '1044',
        user: 'mike_j@example.com',
        subject: 'App crashes on map view',
        status: 'Resolved',
        date: '2023-10-22 09:00 AM',
    },
];

export default function AdminSupportTicketsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Support Tickets</Title>
                    <Text type="secondary">View and resolve user issues</Text>
                </div>
                <div>
                    <Input
                        placeholder="Search tickets..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-full w-64"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-4">
                    {/* Filters could go here */}
                    <Space>
                        <Tag color="blue" className="cursor-pointer">All (3)</Tag>
                        <Tag className="cursor-pointer">Open (1)</Tag>
                        <Tag className="cursor-pointer">In Progress (1)</Tag>
                        <Tag className="cursor-pointer">Resolved (1)</Tag>
                    </Space>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}
