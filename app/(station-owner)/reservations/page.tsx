"use client";

import React from 'react';
import { Typography, Table, Tag, Input, Space, Button, DatePicker } from 'antd';
import { SearchOutlined, PrinterOutlined } from '@ant-design/icons';

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

const data = [
    {
        key: '1',
        id: 'BKR-92834',
        passenger: 'Alice Johnson',
        train: 'T-Express 401',
        date: 'Oct 25, 2023 - 14:00',
        status: 'Confirmed',
        amount: '$45.00',
    },
    {
        key: '2',
        id: 'BKR-92835',
        passenger: 'Bob Smith',
        train: 'Commuter Line A',
        date: 'Oct 25, 2023 - 15:30',
        status: 'Pending',
        amount: '$12.50',
    },
    {
        key: '3',
        id: 'BKR-92836',
        passenger: 'Charlie Brown',
        train: 'T-Express 401',
        date: 'Oct 26, 2023 - 09:15',
        status: 'Cancelled',
        amount: '$45.00',
    },
];

export default function StationOwnerReservationsPage() {
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
                        <Tag color="blue" className="cursor-pointer text-sm py-1 px-3">All (145)</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3">Confirmed (120)</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3">Pending (15)</Tag>
                        <Tag className="cursor-pointer text-sm py-1 px-3">Cancelled (10)</Tag>
                    </Space>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}
