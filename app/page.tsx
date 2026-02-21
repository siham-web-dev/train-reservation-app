"use client";

import { useState, useEffect } from 'react';
import { Layout, Input, Button, FloatButton, Typography, Spin, DatePicker, Dropdown, Avatar, MenuProps } from 'antd';
import {
  RobotOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MenuOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import SignIn from './components/SignIn';
import ContactAdminstrator from './components/ContactAdminstrator';
import ChatbotBox from './components/ChatbotBox';
import { supabase } from '@/lib/supabase/client';
//import { useRouter } from 'next/navigation';
import { signOut } from './actions/auth';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Dynamically import the Map component to avoid SSR issues with window object
const InteractiveMap = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
      <Spin size="large" />
    </div>
  )
});

export default function Home() {
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isTrackSidebarVisible, setIsTrackSidebarVisible] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  // const router = useRouter();
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };


  useEffect(() => {
    getSession();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    }
  }, [supabase.auth]);

  const handleLogout = async () => {
    await signOut();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Navbar */}
      <Header className="flex items-center justify-between px-4 lg:px-8 bg-white border-b border-gray-200 top-0 z-50 w-full ">
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <div className="flex justify-center items-center">
            <Image src="/logo.png" alt="TrainRes Logo" width={60} height={50} className='w-[70px] h-[60px]' />
          </div>
          {/* Desktop Search & Filters */}
          <div className="hidden lg:flex items-center gap-3 w-[600px]">
            <Input
              placeholder="Search destinations, stations, or train numbers"
              prefix={<SearchOutlined className="text-gray-400" />}
              size="large"
              className="rounded-full bg-gray-50 hover:bg-white focus:bg-white transition-colors flex-1"
            />
            <DatePicker size="large" className="rounded-full bg-gray-50 hover:bg-white w-40" placeholder="Date" />
            {/* departure time , arrival time */}

          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Button type="text" icon={<PhoneOutlined />} size="large" className="font-medium text-gray-600 hover:text-blue-600" onClick={() => setIsContactModalVisible(true)}>
            Contact Administrator
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-full transition-colors border border-gray-100 pr-4">
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  icon={<UserOutlined />}
                  className="bg-blue-600 shadow-sm"
                />
                <div className="flex flex-col">
                  <Text strong className="text-[13px] leading-tight max-w-[120px] truncate">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </Text>
                  <Text type="secondary" className="text-[10px] leading-tight">Member</Text>
                </div>
                <DownOutlined className="text-[10px] text-gray-400" />
              </div>
            </Dropdown>
          ) : (
            <Button type="primary" icon={<UserOutlined />} size="large" className="rounded-full px-6 font-medium shadow-md shadow-blue-500/20" onClick={() => setIsSignInModalVisible(true)}>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center">
          <Button type="text" icon={<MenuOutlined className="text-xl" />} />
        </div>
      </Header>

      <Content className="flex flex-col relative w-full h-[calc(100vh-64px)]">
        {/* Mobile Search (Visible on md and smaller) */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-100 z-40">
          <Input
            placeholder="Search destinations..."
            prefix={<SearchOutlined className="text-gray-400" />}
            size="large"
            className="w-full rounded-full bg-gray-50"
          />
        </div>

        {/* Map Container */}
        <div className="flex-1 relative p-4 flex flex-col bg-slate-50">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">

            {/* Track Train Left Sidebar Overlay */}
            {isTrackSidebarVisible ? (
              <div className="absolute top-4 left-4 z-[400] w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden transition-all duration-300">
                <div className="p-4 border-b border-gray-100 bg-blue-50/50 flex justify-between items-center">
                  <Title level={5} className="!m-0 flex items-center gap-2 text-blue-800">
                    <CompassOutlined className="text-blue-600" />
                    Track Your Train
                  </Title>
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    size="small"
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => setIsTrackSidebarVisible(false)}
                  />
                </div>

                <div className="p-4 flex flex-col gap-4">
                  <div className="space-y-1">
                    <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">Train Number</Text>
                    <Input
                      placeholder="e.g. T-492"
                      size="large"
                      prefix={<SearchOutlined className="text-gray-400" />}
                      className="rounded-lg"
                    />
                  </div>

                  <Button type="primary" size="large" className="w-full rounded-lg shadow-sm">
                    Track Now
                  </Button>

                  {/* Example Tracking State (can be hidden optionally when no train is tracked) */}
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <EnvironmentOutlined className="text-blue-500 text-lg" />
                      </div>
                      <div>
                        <Text strong className="block text-sm">Status: Pre-boarding</Text>
                        <Text type="secondary" className="text-xs">Est. Departure: 14:30 PM (Platform 4)</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                type="primary"
                shape="circle"
                icon={<CompassOutlined className="text-xl" />}
                size="large"
                className="absolute top-4 left-4 z-[400] shadow-xl shadow-blue-500/30 flex items-center justify-center w-12 h-12"
                onClick={() => setIsTrackSidebarVisible(true)}
              />
            )}

            <InteractiveMap />
          </div>
        </div>
      </Content>

      {/* Chatbot Float Button */}
      <FloatButton
        icon={<RobotOutlined className="text-xl" />}
        type="primary"
        shape="circle"
        style={{ right: 24, bottom: 24, width: 60, height: 60 }}
        tooltip={<div className="font-medium px-1 py-0.5">Ask Chatbot</div>}
        onClick={() => setIsChatVisible(true)}
        className={`shadow-2xl shadow-blue-500/40 transition-opacity duration-300 ${isChatVisible ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
      />

      {/* Chatbot Interface UI */}
      {isChatVisible && (
        <ChatbotBox isVisible={isChatVisible} onClose={() => setIsChatVisible(false)} />
      )}

      <SignIn setIsSignInModalVisible={setIsSignInModalVisible} isSignInModalVisible={isSignInModalVisible} />
      <ContactAdminstrator setIsContactModalVisible={setIsContactModalVisible} isContactModalVisible={isContactModalVisible} />
    </Layout>
  );
}
