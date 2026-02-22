"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Input, Space, Button, Spin } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getSupportTickets } from '@/app/actions/support';

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

export default function AdminSupportTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTickets() {
            const result = await getSupportTickets();
            if ('error' in result) {
                console.error(result.error);
            } else {
                setTickets(result.data || []);
            }
            setLoading(false);
        }
        loadTickets();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spin size="large" />
            </div>
        );
    }

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
                    <Space>
                        <Tag color="blue" className="cursor-pointer">All ({tickets.length})</Tag>
                        <Tag className="cursor-pointer">Open ({tickets.filter(t => t.status === 'Open').length})</Tag>
                        <Tag className="cursor-pointer">In Progress ({tickets.filter(t => t.status === 'In Progress').length})</Tag>
                        <Tag className="cursor-pointer">Resolved ({tickets.filter(t => t.status === 'Resolved').length})</Tag>
                    </Space>
                </div>
                <Table columns={columns} dataSource={tickets} />
            </div>
        </div>
    );
}
