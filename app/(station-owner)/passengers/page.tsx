"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Input, Button, Tag, Avatar, Spin } from 'antd';
import { SearchOutlined, DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { getUserProfile } from '@/app/actions/auth';
import { getStationPassengers } from '@/app/actions/bookings';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Passenger Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any) => (
            <div className="flex items-center gap-3">
                <Avatar src={record.avatar} icon={<UserOutlined />} />
                <Text strong>{text}</Text>
            </div>
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
        title: 'Frequent Route',
        dataIndex: 'route',
        key: 'route',
    },
    {
        title: 'Total Trips',
        dataIndex: 'trips',
        key: 'trips',
        sorter: (a: any, b: any) => a.trips - b.trips,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>
        ),
    },
];

export default function StationOwnerPassengersPage() {
    const [passengers, setPassengers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const profileRes = await getUserProfile();
        if (profileRes.data?.station_id) {
            const passengersRes = await getStationPassengers(profileRes.data.station_id);
            if (!('error' in passengersRes)) {
                setPassengers(passengersRes.data);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Frequent Route', 'Total Trips', 'Status'];
        const csvContent = [
            headers.join(','),
            ...passengers.map(p => [
                p.name,
                p.email,
                `"${p.route}"`,
                p.trips,
                p.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `passengers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={2} className="!m-0 text-gray-800">Passenger Directory</Title>
                    <Text type="secondary">View passenger history and statistics</Text>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Input
                        placeholder="Search passengers by name or email..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-lg w-full sm:w-72"
                    />
                    <Button
                        icon={<DownloadOutlined />}
                        className="rounded-lg shadow-sm"
                        onClick={exportToCSV}
                        disabled={passengers.length === 0}
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <Table columns={columns} dataSource={passengers} />
            </div>
        </div>
    );
}
