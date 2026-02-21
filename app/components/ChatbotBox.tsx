import React, { useState } from 'react';
import { Button, Input, List, Avatar, Card, Typography } from 'antd';
import { RobotOutlined, UserOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatbotBox({
    isVisible,
    onClose
}: {
    isVisible: boolean;
    onClose: () => void;
}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I am your TrainRes assistant. How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');

    if (!isVisible) return null;

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: 'I can help you search for trains, book tickets, or check statuses. What would you like to do?',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <Card
            className="fixed bottom-28 right-6 w-80 md:w-96 shadow-2xl z-[500] border-gray-200 overflow-hidden flex flex-col"
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '400px' } }}
            title={
                <div className="flex items-center gap-2">
                    <RobotOutlined className="text-blue-500 text-xl" />
                    <Text strong className="text-gray-800">TrainRes Assistant</Text>
                </div>
            }
            extra={
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={onClose}
                    className="text-gray-500 hover:text-red-500"
                />
            }
        >
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar
                            icon={msg.sender === 'bot' ? <RobotOutlined /> : <UserOutlined />}
                            className={msg.sender === 'bot' ? 'bg-blue-500 flex-shrink-0' : 'bg-green-500 flex-shrink-0'}
                        />
                        <div
                            className={`p-3 rounded-2xl max-w-[75%] ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none'
                                }`}
                        >
                            <Text className={msg.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                                {msg.text}
                            </Text>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={handleSend}
                    className="rounded-full bg-slate-50"
                    variant={"borderless"}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="shadow-md shadow-blue-500/20"
                />
            </div>
        </Card>
    );
}
