"use client";
import { Layout, Typography, Table, Tag, Input, Button, DatePicker, Select } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const columns = [
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (text: string) => (
            <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-gray-400" />
                <Text strong className="text-lg">{text}</Text>
            </div>
        ),
    },
    {
        title: 'Destination',
        dataIndex: 'destination',
        key: 'destination',
        render: (text: string) => <Text strong className="text-gray-800">{text}</Text>,
    },
    {
        title: 'Train',
        dataIndex: 'train',
        key: 'train',
        render: (text: string, record: any) => (
            <div className="flex items-center gap-3">
                <img src={record.image} alt={text} className="w-16 h-10 object-cover rounded shadow-sm" />
                <Text type="secondary">{text}</Text>
            </div>
        ),
    },
    {
        title: 'Platform',
        dataIndex: 'platform',
        key: 'platform',
        render: (text: string) => <Tag color="blue" className="px-3 py-1 font-bold text-sm">{text}</Tag>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'On Time' ? 'success' : status === 'Delayed' ? 'error' : 'warning'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Button type="primary" className="rounded-lg">Book Ticket</Button>
        ),
    },
];

const data = [
    {
        key: '1',
        time: '08:30 AM',
        destination: 'Lyon Part-Dieu',
        train: 'TGV INOUI 6603',
        platform: 'Hall 1',
        status: 'On Time',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
        key: '2',
        time: '09:15 AM',
        destination: 'Marseille St-Charles',
        train: 'TGV INOUI 6101',
        platform: 'Hall 2',
        status: 'Delayed',
        image: 'https://images.unsplash.com/photo-1551139459-7bb39dada531?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
        key: '3',
        time: '10:00 AM',
        destination: 'Montpellier',
        train: 'OUIGO 7843',
        platform: 'Hall 1',
        status: 'On Time',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
        key: '4',
        time: '11:45 AM',
        destination: 'Nice Ville',
        train: 'TGV INOUI 6173',
        platform: 'Hall 2',
        status: 'On Time',
        image: 'https://images.unsplash.com/photo-1558066373-addc4c70dcdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
];

export default function StationSchedulePage() {
    return (
        <Layout className="min-h-screen bg-slate-50">
            <Header className="flex items-center px-4 lg:px-8 bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center gap-4 w-full">
                    <Link href="/">
                        <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-blue-600">
                            Back to Map
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <Title level={4} className="!m-0 text-blue-800">Paris Gare de Lyon - Schedule</Title>
                </div>
            </Header>

            <Content className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Station Header Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden flex-shrink-0">
                                <img src="https://api.dicebear.com/7.x/initials/svg?seed=PGL" alt="Station Logo" className="w-14 h-14 object-contain" />
                            </div>
                            <div>
                                <Title level={2} className="!m-0">Paris Gare de Lyon</Title>
                                <Text type="secondary" className="text-base">Place Louis-Armand, 75012 Paris, France</Text>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <DatePicker size="large" className="w-full md:w-auto rounded-lg" />
                            <Select
                                defaultValue="All Destinations"
                                size="large"
                                className="w-full md:w-48 rounded-lg"
                                options={[
                                    { label: 'All Destinations', value: 'all' },
                                    { label: 'Lyon', value: 'lyon' },
                                    { label: 'Marseille', value: 'marseille' },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <Title level={4} className="!m-0">Live Departures</Title>
                        <Input
                            placeholder="Search train or destination..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="w-64 rounded-full"
                        />
                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} className="overflow-x-auto" />
                </div>
            </Content>
        </Layout>
    );
}
