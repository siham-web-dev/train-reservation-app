"use client";

import React from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button } from 'antd';
import { DollarOutlined, RiseOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Transaction ID',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <Text className="text-gray-500">{text}</Text>,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: string) => <Text strong>{text}</Text>,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (text: string) => <Text strong className="text-green-600">{text}</Text>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'Completed' ? 'success' : 'processing'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
];

const data = [
    {
        key: '1',
        id: 'TRX-892347',
        description: 'Station Subscription (Central)',
        amount: '+$500.00',
        status: 'Completed',
        date: 'Oct 24, 2023',
    },
    {
        key: '2',
        id: 'TRX-892348',
        description: 'Ticket Commission (100 bookings)',
        amount: '+$150.00',
        status: 'Completed',
        date: 'Oct 23, 2023',
    },
    {
        key: '3',
        id: 'TRX-892349',
        description: 'Station Subscription (North)',
        amount: '+$300.00',
        status: 'Pending',
        date: 'Oct 23, 2023',
    },
];

export default function AdminBillingPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Billing & Finance</Title>
                    <Text type="secondary">Overview of revenue and transactions</Text>
                </div>
                <Button icon={<DownloadOutlined />} className="rounded-lg">
                    Export Report
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card className="rounded-xl shadow-sm border-gray-100 h-full">
                        <Statistic
                            title="Total Revenue (This Month)"
                            value={45231.89}
                            precision={2}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                            <RiseOutlined /> +12.5% from last month
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="rounded-xl shadow-sm border-gray-100 h-full">
                        <Statistic
                            title="Active Subscriptions"
                            value={142}
                            valueStyle={{ color: '#1677ff' }}
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            Across 45 stations
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="rounded-xl shadow-sm border-gray-100 h-full bg-blue-50/50 border-blue-100">
                        <Title level={4} className="!mt-0 !mb-1 text-blue-800">Payout Available</Title>
                        <div className="text-3xl font-bold text-blue-600 mb-4">$12,450.00</div>
                        <Button type="primary" className="shadow-md shadow-blue-500/20">Process Payout</Button>
                    </Card>
                </Col>
            </Row>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                <Title level={4} className="!mt-0 !mb-4">Recent Transactions</Title>
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
            </div>
        </div>
    );
}
