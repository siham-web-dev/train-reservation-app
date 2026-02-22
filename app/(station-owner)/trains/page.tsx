"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Space, Tag, Input, Spin, Modal, Form, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { getUserProfile } from '@/app/actions/auth';
import { getStationTrains, addTrain, getTrainCoaches, updateSeat, addSeat, deleteSeat } from '@/app/actions/fleet';
import { PlusCircleOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CoachSeatDetails = ({ trainId }: { trainId: number }) => {
    const [coaches, setCoaches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSeatId, setEditingSeatId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<any>({ seat_number: '', seat_type: '' });
    const [isAddingSeat, setIsAddingSeat] = useState<number | null>(null); // coachId

    const fetchCoaches = async () => {
        setLoading(true);
        const res = await getTrainCoaches(trainId);
        if (!res.error && res.data) {
            setCoaches(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoaches();
    }, [trainId]);

    const handleEditSeat = (seat: any) => {
        setEditingSeatId(seat.id);
        setEditValues({ seat_number: seat.seat_number, seat_type: seat.seat_type });
    };

    const handleSaveSeat = async (seatId: number) => {
        const res = await updateSeat(seatId, editValues);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Seat updated');
            setEditingSeatId(null);
            fetchCoaches();
        }
    };

    const handleDeleteSeat = async (seatId: number) => {
        const res = await deleteSeat(seatId);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Seat deleted');
            fetchCoaches();
        }
    };

    const handleAddSeat = async (coachId: number) => {
        const res = await addSeat(coachId, editValues);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Seat added');
            setIsAddingSeat(null);
            setEditValues({ seat_number: '', seat_type: '' });
            fetchCoaches();
        }
    };

    if (loading && coaches.length === 0) return <Spin size="small" />;

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <Title level={5} className="!m-0">Coach & Seat Layout</Title>
                <div className="flex gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-blue-100 border border-blue-200" /> Window</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-green-100 border border-green-200" /> Aisle</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-gray-100 border border-gray-200" /> Middle</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => (
                    <div key={coach.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <Text strong className="text-blue-600">Coach {coach.coach_number}</Text>
                            <Tag color="cyan">{coach.class}</Tag>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {coach.seats.map((seat: any) => (
                                <div
                                    key={seat.id}
                                    className={`relative h-10 flex flex-col items-center justify-center text-[10px] rounded border transition-all hover:border-blue-400 cursor-pointer ${editingSeatId === seat.id ? 'border-blue-500 shadow-sm' :
                                        seat.seat_type === 'window' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                            seat.seat_type === 'aisle' ? 'bg-green-50 border-green-200 text-green-600' :
                                                'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}
                                    onClick={() => handleEditSeat(seat)}
                                >
                                    {editingSeatId === seat.id ? (
                                        <div className="absolute -top-12 left-0 z-10 bg-white p-2 shadow-xl border rounded flex flex-col gap-2 w-32" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                size="small"
                                                value={editValues.seat_number}
                                                onChange={e => setEditValues({ ...editValues, seat_number: e.target.value })}
                                                placeholder="No."
                                            />
                                            <Select
                                                size="small"
                                                value={editValues.seat_type}
                                                onChange={val => setEditValues({ ...editValues, seat_type: val })}
                                            >
                                                <Select.Option value="window">Window</Select.Option>
                                                <Select.Option value="aisle">Aisle</Select.Option>
                                                <Select.Option value="middle">Middle</Select.Option>
                                            </Select>
                                            <div className="flex justify-between">
                                                <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSeat(seat.id)} />
                                                <Space>
                                                    <Button size="small" type="text" icon={<CloseOutlined />} onClick={() => setEditingSeatId(null)} />
                                                    <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleSaveSeat(seat.id)} />
                                                </Space>
                                            </div>
                                        </div>
                                    ) : null}
                                    <span className="font-bold">{seat.seat_number}</span>
                                    <span className="text-[8px] uppercase opacity-60">{seat.seat_type?.charAt(0)}</span>
                                </div>
                            ))}
                            <Button
                                type="dashed"
                                className="h-10 border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-500"
                                icon={<PlusCircleOutlined />}
                                onClick={() => {
                                    setIsAddingSeat(coach.id);
                                    setEditValues({ seat_number: '', seat_type: 'window' });
                                }}
                            />
                        </div>

                        {isAddingSeat === coach.id && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-4 shadow-2xl border rounded-lg w-48 animate-in fade-in zoom-in duration-200">
                                <Title level={5} className="!text-sm mb-3">Add New Seat</Title>
                                <Space direction="vertical" className="w-full">
                                    <Input
                                        placeholder="Seat Number"
                                        value={editValues.seat_number}
                                        onChange={e => setEditValues({ ...editValues, seat_number: e.target.value })}
                                    />
                                    <Select
                                        className="w-full"
                                        value={editValues.seat_type}
                                        onChange={val => setEditValues({ ...editValues, seat_type: val })}
                                    >
                                        <Select.Option value="window">Window</Select.Option>
                                        <Select.Option value="aisle">Aisle</Select.Option>
                                        <Select.Option value="middle">Middle</Select.Option>
                                    </Select>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button size="small" onClick={() => setIsAddingSeat(null)}>Cancel</Button>
                                        <Button size="small" type="primary" onClick={() => handleAddSeat(coach.id)}>Add</Button>
                                    </div>
                                </Space>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-start gap-2 text-gray-400 text-xs bg-blue-50 p-2 rounded">
                <InfoCircleOutlined className="mt-0.5 text-blue-400" />
                <span>Tip: Click on a seat to edit its number or type. You can also add more seats to each coach.</span>
            </div>
        </div>
    );
};

const columns = [
    {
        title: 'Train Name/ID',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <Text strong>{text}</Text>,
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Coaches',
        dataIndex: 'coach_count',
        key: 'coach_count',
        render: (count: number) => <Tag color="blue">{count} Coaches</Tag>,
    },
    {
        title: 'Capacity',
        dataIndex: 'capacity',
        key: 'capacity',
        render: (cap: number) => <span>{cap} Seats</span>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'Operational' ? 'success' : status === 'In Transit' ? 'processing' : 'warning'}>
                {status}
            </Tag>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button type="text" icon={<EditOutlined className="text-blue-500" />}>Edit</Button>
            </Space>
        ),
    },
];

export default function StationOwnerTrainsPage() {
    const [trains, setTrains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [userProfile, setUserProfile] = useState<any>(null);

    const loadData = async () => {
        setLoading(true);
        const profileRes = await getUserProfile();
        if (profileRes.data?.station_id) {
            console.log("profileRes.data = ", profileRes.data?.station_id);

            setUserProfile(profileRes.data);
            const res = await getStationTrains(profileRes.data.station_id);
            if (!('error' in res)) {
                setTrains(res.data);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddTrain = async (values: any) => {
        if (!userProfile?.station_id) {
            message.error('Station ID not found. Please try again or contact support.');
            return;
        }
        setSubmitting(true);
        const res = await addTrain({ ...values, station_id: userProfile.station_id });
        setSubmitting(false);
        if (res.error) {
            message.error(res.error);
        } else {
            message.success('Train added successfully with coaches and seats!');
            setIsModalVisible(false);
            form.resetFields();
            loadData();
        }
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
                    <Title level={2} className="!m-0 text-gray-800">Fleet Management</Title>
                    <Text type="secondary">Manage your trains and their statuses</Text>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Input
                        placeholder="Search trains..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="rounded-lg w-full sm:w-64"
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="rounded-lg shadow-md shadow-blue-500/20"
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add Train
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={trains}
                    expandable={{
                        expandedRowRender: (record) => <CoachSeatDetails trainId={parseInt(record.key)} />,
                        rowExpandable: (record) => record.coach_count > 0,
                    }}
                />
            </div>

            <Modal
                title="Add New Train"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleAddTrain} initialValues={{ num_coaches: 1, seats_per_coach: 40, coach_class: 'economy' }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Train Number" name="train_number" required rules={[{ required: true, message: 'Please enter train number' }]}>
                            <Input placeholder="e.g., T-101" />
                        </Form.Item>
                        <Form.Item label="Train Name" name="name">
                            <Input placeholder="e.g., Express Express" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="Coaches" name="num_coaches" required rules={[{ required: true, message: 'Required' }]}>
                            <Input type="number" min={1} />
                        </Form.Item>
                        <Form.Item label="Seats / Coach" name="seats_per_coach" required rules={[{ required: true, message: 'Required' }]}>
                            <Input type="number" min={1} />
                        </Form.Item>
                        <Form.Item label="Coach Class" name="coach_class">
                            <Select>
                                <Select.Option value="economy">Economy</Select.Option>
                                <Select.Option value="AC">AC</Select.Option>
                                <Select.Option value="sleeper">Sleeper</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Add Train</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
