"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Input, Space, Button, Spin, Select, message, Descriptions } from 'antd';
import { SearchOutlined, PrinterOutlined, PlusOutlined, ArrowRightOutlined, ClockCircleOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { getUserProfile } from '@/app/actions/auth';
import { getStationReservations, updateBookingStatus } from '@/app/actions/bookings';
import { BookingStatus } from '@prisma/client';

const { Title, Text } = Typography;

export default function BookingManagementPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    const loadData = async () => {
        setLoading(true);
        const profileRes = await getUserProfile();
        if (profileRes.data?.station_id) {
            const res = await getStationReservations(profileRes.data.station_id);
            if (!('error' in res)) {
                setBookings(res.data);
            } else {
                message.error(res.error);
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
            message.success('Booking status updated successfully');
            loadData();
        }
    };

    const filteredData = bookings.filter(item => {
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesSearch =
            item.passenger.toLowerCase().includes(searchText.toLowerCase()) ||
            item.id.toLowerCase().includes(searchText.toLowerCase()) ||
            item.train.toLowerCase().includes(searchText.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text strong className="text-blue-600 font-mono">{text}</Text>,
        },
        {
            title: 'Passenger',
            dataIndex: 'passenger',
            key: 'passenger',
            render: (text: string) => <Text className="font-medium text-gray-700">{text}</Text>
        },
        {
            title: 'Train',
            dataIndex: 'train',
            key: 'train',
            render: (text: string) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Route',
            dataIndex: 'route',
            key: 'route',
            render: (route: string) => {
                const [source, dest] = route.split(' → ');
                return (
                    <Space>
                        <Text type="secondary">{source}</Text>
                        <ArrowRightOutlined className="text-gray-300 text-xs" />
                        <Text strong>{dest}</Text>
                    </Space>
                );
            }
        },
        {
            title: 'Schedule',
            key: 'schedule',
            render: (_: any, record: any) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ClockCircleOutlined />
                        <span>{record.date}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Tag color="blue" className="m-0">{record.departure}</Tag>
                        <Text type="secondary" className="text-xs">→</Text>
                        <Tag color="cyan" className="m-0">{record.arrival}</Tag>
                    </div>
                </div>
            )
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
                    className="status-select-modern"
                    bordered={false}
                    dropdownStyle={{ borderRadius: '8px' }}
                >
                    <Select.Option value="pending">
                        <Tag color="warning" className="w-full text-center">Pending</Tag>
                    </Select.Option>
                    <Select.Option value="confirmed">
                        <Tag color="success" className="w-full text-center">Confirmed</Tag>
                    </Select.Option>
                    <Select.Option value="cancelled">
                        <Tag color="error" className="w-full text-center">Cancelled</Tag>
                    </Select.Option>
                    <Select.Option value="waitlisted">
                        <Tag color="processing" className="w-full text-center">Waitlisted</Tag>
                    </Select.Option>
                </Select>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: string) => <Text strong className="text-gray-900">{text}</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="text" icon={<PrinterOutlined className="text-gray-400 hover:text-blue-500" />} />
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const stats = {
        all: bookings.length,
        confirmed: bookings.filter(r => r.status === 'confirmed').length,
        pending: bookings.filter(r => r.status === 'pending').length,
        cancelled: bookings.filter(r => r.status === 'cancelled').length,
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-100 text-white">
                            <ReconciliationOutlined size={24} />
                        </div>
                        <Title level={1} className="!m-0 !text-3xl font-bold text-slate-900 tracking-tight">Booking Management</Title>
                    </div>
                    <Text className="text-slate-500 text-lg">Real-time oversight of station activities and route schedules</Text>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <Input
                        placeholder="Search IDs, Patients or Trains..."
                        prefix={<SearchOutlined className="text-slate-400" />}
                        className="w-full sm:w-80 h-12 rounded-xl border-slate-200 hover:border-blue-400 focus:shadow-lg transition-all"
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 border-none shadow-md shadow-blue-200 flex items-center gap-2 font-semibold"
                        onClick={() => message.info('Add Booking functionality coming soon')}
                    >
                        Add Booking
                    </Button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Tabs / Filter Row */}
                <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-6 bg-white">
                    <Space wrap size={12}>
                        <div
                            className={`px-5 py-2 rounded-full cursor-pointer transition-all font-medium text-sm flex items-center gap-2 ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            All Bookings <span className={`px-2 py-0.5 rounded-full text-xs ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{stats.all}</span>
                        </div>
                        <div
                            className={`px-5 py-2 rounded-full cursor-pointer transition-all font-medium text-sm flex items-center gap-2 ${filterStatus === 'confirmed' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            onClick={() => setFilterStatus('confirmed')}
                        >
                            Confirmed <span className={`px-2 py-0.5 rounded-full text-xs ${filterStatus === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{stats.confirmed}</span>
                        </div>
                        <div
                            className={`px-5 py-2 rounded-full cursor-pointer transition-all font-medium text-sm flex items-center gap-2 ${filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            onClick={() => setFilterStatus('pending')}
                        >
                            Pending <span className={`px-2 py-0.5 rounded-full text-xs ${filterStatus === 'pending' ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-600'}`}>{stats.pending}</span>
                        </div>
                        <div
                            className={`px-5 py-2 rounded-full cursor-pointer transition-all font-medium text-sm flex items-center gap-2 ${filterStatus === 'cancelled' ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            onClick={() => setFilterStatus('cancelled')}
                        >
                            Cancelled <span className={`px-2 py-0.5 rounded-full text-xs ${filterStatus === 'cancelled' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{stats.cancelled}</span>
                        </div>
                    </Space>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                            pageSize: 10,
                            className: "!px-6 py-4 border-t border-slate-100",
                            showSizeChanger: true,
                            showTotal: (total) => <span className="text-slate-500 font-medium">Total {total} bookings</span>
                        }}
                        className="booking-table custom-pagination"
                        rowClassName={() => "hover:bg-slate-50/50 transition-colors"}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div className="bg-slate-50/80 p-8 border-y border-slate-100 shadow-inner">
                                    <div className="max-w-6xl mx-auto space-y-6">
                                        <div className="flex items-center justify-between">
                                            <Title level={5} className="!m-0 text-slate-800 flex items-center gap-2">
                                                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                                Passenger & Seating Manifest
                                            </Title>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {record.details.map((p: any) => (
                                                <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <Text strong className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{p.name}</Text>
                                                        <Tag color="purple" className="rounded-md font-bold m-0 px-3 py-0.5 border-none shadow-sm shadow-purple-100 uppercase tracking-wider text-[10px]">{p.seat}</Tag>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 p-3 rounded-lg">
                                                            <Text type="secondary" className="block text-[10px] uppercase font-bold tracking-widest mb-1">Age</Text>
                                                            <Text strong className="text-slate-700">{p.age || 'N/A'}</Text>
                                                        </div>
                                                        <div className="bg-slate-50 p-3 rounded-lg">
                                                            <Text type="secondary" className="block text-[10px] uppercase font-bold tracking-widest mb-1">Gender</Text>
                                                            <Text strong className="text-slate-700">{p.gender || 'N/A'}</Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>

            <style jsx global>{`
                .booking-table .ant-table-thead > tr > th {
                    background: #fcfdfe !important;
                    color: #64748b !important;
                    font-weight: 600 !important;
                    text-transform: uppercase !important;
                    font-size: 11px !important;
                    letter-spacing: 0.05em !important;
                    padding: 20px 24px !important;
                    border-bottom: 2px solid #f1f5f9 !important;
                }
                .booking-table .ant-table-tbody > tr > td {
                    padding: 20px 24px !important;
                    border-bottom: 1px solid #f8fafc !important;
                }
                .status-select-modern .ant-select-selector {
                    padding: 0 !important;
                }
                .custom-pagination .ant-pagination-item-active {
                    background: #2563eb !important;
                    border-color: #2563eb !important;
                }
                .custom-pagination .ant-pagination-item-active a {
                    color: white !important;
                }
            `}</style>
        </div>
    );
}