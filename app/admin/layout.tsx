"use client";

import React, { useState } from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import {
    BankOutlined,
    CustomerServiceOutlined,
    CreditCardOutlined,
    BarChartOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Layout className="min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="border-r border-gray-200 shadow-sm">
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    {!collapsed ? (
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Logo" width={40} height={35} />
                            <Title level={4} className="!m-0 !text-blue-600">Admin</Title>
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
                            key: '/admin/stations',
                            icon: <BankOutlined />,
                            label: <Link href="/admin/stations">Stations</Link>,
                        },
                        {
                            key: '/admin/support-tickets',
                            icon: <CustomerServiceOutlined />,
                            label: <Link href="/admin/support-tickets">Support Tickets</Link>,
                        },
                        {
                            key: '/admin/billing',
                            icon: <CreditCardOutlined />,
                            label: <Link href="/admin/billing">Billing</Link>,
                        },
                        {
                            key: '/admin/analytics',
                            icon: <BarChartOutlined />,
                            label: <Link href="/admin/analytics">Analytics</Link>,
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
                <Header className="bg-white p-0 flex items-center justify-between px-4 border-b border-gray-200">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-lg w-16 h-16"
                    />
                    <div className="flex items-center gap-4 pr-4">
                        <div className="text-sm font-medium text-gray-700">Admin User</div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </Header>
                <Content className="m-6 p-6 min-h-[280px] bg-slate-50/50 rounded-lg shadow-inner">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
