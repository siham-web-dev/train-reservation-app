"use client";

import React from 'react';
import { Typography, Row, Col, Card, Progress } from 'antd';
import { RiseOutlined, FireOutlined, LineChartOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StationOwnerAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <Title level={2} className="!m-0 text-gray-800">Station Analytics</Title>
                <Text type="secondary">Performance insights for your station</Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="rounded-xl shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                        <Text type="secondary" className="block mb-2 font-medium">Daily Passengers</Text>
                        <div className="flex items-baseline gap-2">
                            <Title level={2} className="!m-0">4,289</Title>
                            <Text className="text-green-500 text-sm"><RiseOutlined /> +8.2%</Text>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">vs. previous day</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="rounded-xl shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                        <Text type="secondary" className="block mb-2 font-medium">Revenue (Today)</Text>
                        <div className="flex items-baseline gap-2">
                            <Title level={2} className="!m-0">$12.4k</Title>
                            <Text className="text-green-500 text-sm"><RiseOutlined /> +3.1%</Text>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">vs. same day last week</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="rounded-xl shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                        <Text type="secondary" className="block mb-2 font-medium">On-Time Performance</Text>
                        <div className="flex items-center gap-4 mt-2">
                            <Progress type="circle" percent={92} size={60} strokeColor="#52c41a" />
                            <div>
                                <Text strong className="block text-green-600">Excellent</Text>
                                <Text type="secondary" className="text-xs">Target: 90%</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="rounded-xl shadow-sm border-gray-100 hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                            <Text type="secondary" className="font-medium text-orange-800">Busy Hours Alert</Text>
                            <FireOutlined className="text-orange-500 text-lg" />
                        </div>
                        <Title level={4} className="!m-0 !mt-2 text-orange-700">17:00 - 19:00</Title>
                        <Text className="text-sm text-orange-600">Prepare for peak traffic (+40% expected)</Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={16}>
                    <Card title={<><LineChartOutlined className="mr-2 text-blue-500" />Passenger Trends</>} className="rounded-xl shadow-sm border-gray-100 h-full min-h-[350px]">
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                            <div className="w-full h-48 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center">
                                [Interactive Line Chart Area]
                            </div>
                            <Text type="secondary" className="mt-4">Showing passenger volume for the last 7 days</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title={<><ClockCircleOutlined className="mr-2 text-blue-500" />Popular Routes</>} className="rounded-xl shadow-sm border-gray-100 h-full min-h-[350px]">
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text strong>Central to North Junction</Text>
                                    <Text type="secondary">1,245 trips</Text>
                                </div>
                                <Progress percent={85} strokeColor="#1677ff" showInfo={false} />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text strong>Central to Eastside</Text>
                                    <Text type="secondary">890 trips</Text>
                                </div>
                                <Progress percent={60} strokeColor="#1677ff" showInfo={false} />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text strong>Central to West Park</Text>
                                    <Text type="secondary">450 trips</Text>
                                </div>
                                <Progress percent={35} strokeColor="#1677ff" showInfo={false} />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
