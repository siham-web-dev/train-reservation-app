"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Spin } from 'antd';
import { DollarOutlined, RiseOutlined, DownloadOutlined } from '@ant-design/icons';
import { getAdminBillingStats } from '@/app/actions/billing';

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

export default function AdminBillingPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const data = await getAdminBillingStats();
            if ('error' in data) {
                console.error(data.error);
            } else {
                setStats(data);
            }
            setLoading(false);
        }
        loadStats();
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
                            title="Total Revenue (All Time)"
                            value={stats?.totalRevenue || 0}
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
                            value={stats?.activeSubscriptions || 0}
                            valueStyle={{ color: '#1677ff' }}
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            Across the network
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
                <Table columns={columns} dataSource={stats?.recentTransactions || []} pagination={{ pageSize: 5 }} />
            </div>
        </div >
    );
}
