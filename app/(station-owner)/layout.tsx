"use client";

import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Tag } from 'antd';
import {
    SettingOutlined,
    CarOutlined,
    ScheduleOutlined,
    TeamOutlined,
    BarChartOutlined,
    UsergroupAddOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function StationOwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Layout className="min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="border-r border-gray-200 shadow-sm" width={250}>
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    {!collapsed ? (
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Logo" width={40} height={35} />
                            <Title level={4} className="!m-0 !text-blue-800">Station Portal</Title>
                        </Link>
                    ) : (
                        <Link href="/">
                            <Image src="/logo.png" alt="Logo" width={30} height={25} />
                        </Link>
                    )}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={[
                        {
                            key: '/trains',
                            icon: <CarOutlined />,
                            label: <Link href="/trains">Trains</Link>,
                        },
                        {
                            key: '/reservations',
                            icon: <ScheduleOutlined />,
                            label: <Link href="/reservations">Reservations</Link>,
                        },
                        {
                            key: '/passengers',
                            icon: <UsergroupAddOutlined />,
                            label: <Link href="/passengers">Passengers</Link>,
                        },
                        {
                            key: '/drivers',
                            icon: <TeamOutlined />,
                            label: <Link href="/drivers">Drivers</Link>,
                        },
                        {
                            key: '/analytics',
                            icon: <BarChartOutlined />,
                            label: <Link href="/analytics">Analytics</Link>,
                        },
                        {
                            key: '/settings',
                            icon: <SettingOutlined />,
                            label: <Link href="/settings">Settings</Link>,
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: 'logout',
                            icon: <LogoutOutlined className="text-red-500" />,
                            label: <span className="text-red-500">Logout</span>,
                            onClick: () => router.push('/'),
                        },
                    ]}
                    className="mt-4 border-r-0"
                />
            </Sider>
            <Layout>
                <Header className="bg-white p-0 flex items-center justify-between px-4 border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-lg w-16 h-16 mr-2"
                        />
                        <div className="hidden sm:block">
                            <span className="text-gray-500 mr-2">Current Station:</span>
                            <Tag color="geekblue" className="text-base py-1 px-3">Central Station - NY</Tag>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pr-4">
                        <div className="text-sm font-medium text-gray-700">Station Manager</div>
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
                            SM
                        </div>
                    </div>
                </Header>
                <Content className="m-4 sm:m-6 p-4 sm:p-6 min-h-[280px] bg-slate-50/50 rounded-xl shadow-inner border border-gray-100/50">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
