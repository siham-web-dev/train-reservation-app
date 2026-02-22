"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Input, Space, Button, DatePicker, Spin, Select, message, Descriptions } from 'antd';
import { SearchOutlined, PrinterOutlined, FilterOutlined } from '@ant-design/icons';
import { getUserProfile } from '@/app/actions/auth';
import { getStationReservations, updateBookingStatus } from '@/app/actions/bookings';
import { BookingStatus } from '@prisma/client';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function StationOwnerReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    const loadData = async () => {
        setLoading(true);
        const profileRes = await getUserProfile();
        if (profileRes.data?.station_id) {
            const res = await getStationReservations(profileRes.data.station_id);
            if (!('error' in res)) {
                setReservations(res.data);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusUpdate = async (id: string, status: BookingStatus) => {
        const res = await updateBookingStatus(id, status);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Status updated');
            loadData();
        }
    };

    const filteredData = reservations.filter(item => {
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesSearch = item.passenger.toLowerCase().includes(searchText.toLowerCase()) ||
            item.id.toLowerCase().includes(searchText.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text strong className="text-blue-600">{text}</Text>,
        },
        {
            title: 'Passenger',
            dataIndex: 'passenger',
            key: 'passenger',
        },
        {
            title: 'Train Name',
            dataIndex: 'train',
            key: 'train',
        },
        {
            title: 'Departure Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <Select
                    value={status}
                    style={{ width: 130 }}
                    onChange={(val) => handleStatusUpdate(record.key, val as BookingStatus)}
                    className="status-select"
                >
                    <Select.Option value="pending">
                        <Tag color="warning">Pending</Tag>
                    </Select.Option>
                    <Select.Option value="confirmed">
                        <Tag color="success">Confirmed</Tag>
                    </Select.Option>
                    <Select.Option value="cancelled">
                        <Tag color="error">Cancelled</Tag>
                    </Select.Option>
                    <Select.Option value="waitlisted">
                        <Tag color="processing">Waitlisted</Tag>
                    </Select.Option>
                </Select>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="text" icon={<PrinterOutlined className="text-gray-500" />} />
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    const stats = {
        all: reservations.length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        pending: reservations.filter(r => r.status === 'pending').length,
        cancelled: reservations.filter(r => r.status === 'cancelled').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Reservations</Title>
                    <Text type="secondary">Track and manage ticket bookings</Text>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <RangePicker className="w-full sm:w-auto rounded-lg" />
                    <Input
                        placeholder="Search IDs or Passengers..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-full sm:w-64 rounded-lg"
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                    <Space wrap>
                        <Tag
                            color={filterStatus === 'all' ? 'blue' : 'default'}
                            className="cursor-pointer text-sm py-1 px-3"
                            onClick={() => setFilterStatus('all')}
                        >
                            All ({stats.all})
                        </Tag>
                        <Tag
                            color={filterStatus === 'confirmed' ? 'blue' : 'default'}
                            className="cursor-pointer text-sm py-1 px-3"
                            onClick={() => setFilterStatus('confirmed')}
                        >
                            Confirmed ({stats.confirmed})
                        </Tag>
                        <Tag
                            color={filterStatus === 'pending' ? 'blue' : 'default'}
                            className="cursor-pointer text-sm py-1 px-3"
                            onClick={() => setFilterStatus('pending')}
                        >
                            Pending ({stats.pending})
                        </Tag>
                        <Tag
                            color={filterStatus === 'cancelled' ? 'blue' : 'default'}
                            className="cursor-pointer text-sm py-1 px-3"
                            onClick={() => setFilterStatus('cancelled')}
                        >
                            Cancelled ({stats.cancelled})
                        </Tag>
                    </Space>

                    <Button icon={<FilterOutlined />}>More Filters</Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <Title level={5} className="!mb-4">Passenger & Seat Details</Title>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {record.details.map((p: any) => (
                                        <div key={p.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                            <Descriptions title={p.name} column={1} size="small">
                                                <Descriptions.Item label="Age">{p.age || 'N/A'}</Descriptions.Item>
                                                <Descriptions.Item label="Gender">{p.gender || 'N/A'}</Descriptions.Item>
                                                <Descriptions.Item label="Seat">
                                                    <Tag color="purple">{p.seat}</Tag>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                    }}
                />
            </div>
        </div>
    );
}
