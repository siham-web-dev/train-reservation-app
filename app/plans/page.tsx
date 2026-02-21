"use client";

import React from 'react';
import { Typography, Row, Col, Card, Button, List, Space, Tag } from 'antd';
import { CheckOutlined, CrownOutlined, RocketOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

const plans = [
    {
        title: 'Starter',
        price: 'Free',
        description: 'Perfect for small stations starting their digital journey.',
        icon: <RocketOutlined className="text-4xl text-blue-500" />,
        features: [
            'Basic Station Management',
            'Up to 10 Trains / day',
            'Standard Dashboard',
            'Community Support',
            'Email Notifications'
        ],
        buttonText: 'Get Started',
        isPopular: false,
        color: 'blue'
    },
    {
        title: 'Professional',
        price: '$49/mo',
        description: 'Advanced tools for bustling regional hubs.',
        icon: <ThunderboltOutlined className="text-4xl text-amber-500" />,
        features: [
            'Advanced Analytics',
            'Unlimited Trains',
            'Priority Support 24/7',
            'Custom Reports',
            'API Access',
            'Multi-user Access'
        ],
        buttonText: 'Choose Professional',
        isPopular: true,
        color: 'gold'
    },
    {
        title: 'Enterprise',
        price: 'Custom',
        description: 'Full-scale solutions for national railway networks.',
        icon: <CrownOutlined className="text-4xl text-purple-600" />,
        features: [
            'Dedicated Account Manager',
            'Custom Integrations',
            'On-premise Deployment',
            'White-label Solution',
            'SLA Guarantee',
            'Advanced Security'
        ],
        buttonText: 'Contact Sales',
        isPopular: false,
        color: 'purple'
    }
];

export default function PlansPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <div className="flex justify-center mb-6">
                    <Image src="/logo.png" alt="Logo" width={60} height={50} />
                </div>
                <Title level={1} className="!text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Elevate Your Railway Hub
                </Title>
                <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Choose the perfect plan to streamline your station operations and provide world-class service to your passengers.
                </Paragraph>
            </div>

            <Row gutter={[32, 32]} justify="center">
                {plans.map((plan, index) => (
                    <Col xs={24} md={8} key={index}>
                        <Card
                            className={`h-full border-none rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.isPopular ? 'ring-2 ring-amber-400 relative' : 'shadow-xl'}`}
                            bodyStyle={{ padding: '40px' }}
                        >
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 left-0 bg-amber-400 py-2 text-center text-white font-bold text-sm tracking-wider uppercase">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="mb-4">{plan.icon}</div>
                                <Title level={2} className="!mb-1">{plan.title}</Title>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-extrabold">{plan.price}</span>
                                    {plan.price !== 'Custom' && plan.price !== 'Free' && <span className="text-gray-500">/month</span>}
                                </div>
                                <Paragraph className="text-gray-500 leading-relaxed">
                                    {plan.description}
                                </Paragraph>
                            </div>

                            <List
                                className="mb-10"
                                dataSource={plan.features}
                                renderItem={(item) => (
                                    <List.Item className="border-none py-2">
                                        <Space>
                                            <CheckOutlined className={`text-${plan.color === 'gold' ? 'amber' : plan.color}-500 font-bold`} />
                                            <Text className="text-gray-700">{item}</Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />

                            <Link href="/">
                                <Button
                                    type={plan.isPopular ? 'primary' : 'default'}
                                    size="large"
                                    block
                                    className={`h-14 rounded-xl font-bold text-lg ${plan.isPopular ? 'bg-amber-500 hover:bg-amber-600 border-none' : 'hover:border-blue-500 hover:text-blue-600'}`}
                                >
                                    {plan.buttonText}
                                </Button>
                            </Link>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="mt-20 text-center">
                <Text type="secondary">
                    Need a custom plan? <Link href="/support" className="text-blue-600 font-medium">Talk to our railway experts</Link>
                </Text>
            </div>
        </div>
    );
}
