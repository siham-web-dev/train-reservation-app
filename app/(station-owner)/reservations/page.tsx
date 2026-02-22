"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Input, Space, Button, DatePicker, Spin } from 'antd';
import { SearchOutlined, PrinterOutlined } from '@ant-design/icons';
import { getUserProfile } from '@/app/actions/auth';
import { getStationReservations } from '@/app/actions/bookings';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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
        render: (status: string) => {
            let color = 'default';
            if (status === 'Confirmed') color = 'success';
            if (status === 'Cancelled') color = 'error';
            if (status === 'Pending') color = 'warning';
            return <Tag color={color}>{status}</Tag>;
        },
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
            <Button type="text" icon={<PrinterOutlined className="text-gray-500" />} />
        ),
    },
];

export default function StationOwnerReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const profileRes = await getUserProfile();
            if (profileRes.data?.station_id) {
                const res = await getStationReservations(profileRes.data.station_id);
                if (!('error' in res)) {
                    setReservations(res.data);
                }
            }
            setLoading(false);
        }
        loadData();
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Reservations</Title>
                    <Text type="secondary">Track and manage ticket bookings</Text>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <RangePicker className="w-full sm:w-auto rounded-lg" />
                    <Input
                        placeholder="Search bookings..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-full sm:w-56 rounded-lg"
                    />
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="mb-4">
                    <Space wrap>
                        <Tag color="blue" className="cursor-pointer text-sm py-1 px-3">All ({reservations.length})</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3">Confirmed ({reservations.filter(r => r.status === 'Confirmed').length})</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3">Pending ({reservations.filter(r => r.status === 'Pending').length})</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3">Cancelled ({reservations.filter(r => r.status === 'Cancelled').length})</Tag>
                    </Space>
                </div>
                <Table columns={columns} dataSource={reservations} />
            </div>
        </div>
    );
}
