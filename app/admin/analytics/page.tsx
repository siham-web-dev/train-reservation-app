"use client";

import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { UserOutlined, EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <Title level={2} className="!m-0 text-gray-800">Platform Analytics</Title>
                <Text type="secondary">Key performance metrics across the network</Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card className="rounded-xl shadow-sm border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                <UserOutlined />
                            </div>
                            <div>
                                <Text type="secondary" className="block">Total Users</Text>
                                <Title level={3} className="!m-0">24,592</Title>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="rounded-xl shadow-sm border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                                <EnvironmentOutlined />
                            </div>
                            <div>
                                <Text type="secondary" className="block">Active Stations</Text>
                                <Title level={3} className="!m-0">142</Title>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="rounded-xl shadow-sm border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                                <ThunderboltOutlined />
                            </div>
                            <div>
                                <Text type="secondary" className="block">Tickets Booked (Today)</Text>
                                <Title level={3} className="!m-0">3,850</Title>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={16}>
                    <Card title="Traffic Overview" className="rounded-xl shadow-sm border-gray-100 h-full min-h-[300px]">
                        <div className="flex items-center justify-center h-full text-gray-400">
                            [Chart Placeholder: Line chart showing daily active users and bookings]
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Top Stations" className="rounded-xl shadow-sm border-gray-100 h-full min-h-[300px]">
                        <div className="flex items-center justify-center h-full text-gray-400">
                            [Chart Placeholder: Bar chart showing stations with most traffic]
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
