"use client"
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StyleProvider layer hashPriority="high">
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </StyleProvider>
    );
}
