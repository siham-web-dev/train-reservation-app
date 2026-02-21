"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { getStations, createStationWithOwner } from '../../actions/stations';

const { Title, Text } = Typography;

export default function AdminStationsPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [stations, setStations] = useState<any[]>([]);
    const [form] = Form.useForm();

    const fetchStations = async () => {
        setFetching(true);
        const result = await getStations();
        if (result.data) {
            setStations(result.data.map((s: any) => ({
                ...s,
                key: s.id.toString(),
                ownerName: s.users?.[0]?.name || 'N/A',
                ownerEmail: s.users?.[0]?.email || 'N/A',
            })));
        } else if (result.error) {
            message.error(result.error);
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchStations();
    }, []);

    const columns = [
        {
            title: 'Station Info',
            key: 'stationInfo',
            render: (_: any, record: any) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" className="text-xs">{record.code}</Text>
                </Space>
            ),
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'Coordinates',
            key: 'coords',
            render: (_: any, record: any) => (
                <Text type="secondary" className="text-xs">
                    {record.latitude}, {record.longitude}
                </Text>
            ),
        },
        {
            title: 'Owner',
            key: 'owner',
            render: (_: any, record: any) => (
                <Space direction="vertical" size={0}>
                    <Text className="text-sm">{record.ownerName}</Text>
                    <Text type="secondary" className="text-xs font-mono">{record.ownerEmail}</Text>
                </Space>
            ),
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

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const result = await createStationWithOwner(values);
        if (result.success) {
            message.success('Station created and invitation sent!');
            setIsModalVisible(false);
            form.resetFields();
            fetchStations();
        } else {
            message.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Stations Management</Title>
                    <Text type="secondary">Manage all railway stations and their owners</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    className="rounded-lg shadow-md shadow-blue-500/20"
                    onClick={() => setIsModalVisible(true)}
                >
                    Add Station
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Table
                    columns={columns}
                    dataSource={stations}
                    loading={fetching}
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <Modal
                title="Add New Station & Owner"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
                centered
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ country: 'Morocco' }}
                    className="mt-4"
                >
                    <Title level={5} className="mb-4 text-blue-600 border-b pb-2">Station Details</Title>
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item label="Station Name" name="name" rules={[{ required: true, message: 'Please input station name!' }]}>
                                <Input placeholder="e.g. Casablanca Voyageurs" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Station Code" name="code" rules={[{ required: true, message: 'Please input code!' }]}>
                                <Input placeholder="e.g. CASAV" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input city!' }]}>
                                <Input placeholder="Enter city" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Country" name="country">
                                <Input placeholder="Enter country" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Latitude" name="latitude">
                                <InputNumber style={{ width: '100%' }} placeholder="e.g. 33.5892" precision={8} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Longitude" name="longitude">
                                <InputNumber style={{ width: '100%' }} placeholder="e.g. -7.6031" precision={8} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={5} className="mt-6 mb-4 text-blue-600 border-b pb-2">Station Owner info & Invitation</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Owner Full Name" name="ownerName" rules={[{ required: true, message: 'Please input owner name!' }]}>
                                <Input placeholder="Enter full name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Owner Email"
                                name="ownerEmail"
                                rules={[
                                    { required: true, message: 'Please input owner email!' },
                                    { type: 'email', message: 'Please input a valid email!' }
                                ]}
                            >
                                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Enter email address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item className="mt-8 mb-0 flex justify-end">
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading} icon={<MailOutlined />} size="large" className="rounded-lg">
                                Create & Send Invitation
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
