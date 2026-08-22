/**
Copyright 2025 JasmineGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

'use client';
import React, { useEffect, useState } from 'react';
import LoginForm from '@/components/auth/login-form';
import Loading from '@/components/auth/Loading';
import { checkBackendHealth } from '@/services/auth-service';
import { getAllUsers } from '@/services/user-service';
import { Alert, Button, message, Card } from 'antd';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const router = useRouter();
  const [showSetupBackendAlert, setShowSetupBackendAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [healthy, setHealthy] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const pollHealth = async () => {
      const healthy = await checkBackendHealth();
      if (healthy) {
        setHealthy(true);
        setLoading(false);
        clearInterval(interval);
      } else {
        setHealthy(false);
        setLoading(true);
      }
    };
    interval = setInterval(pollHealth, 4000);
    pollHealth();
    return () => clearInterval(interval);
  }, []);

  const getUsers = async () => {
    try {
      const users = await getAllUsers();
      if (users && users.data.length === 0) {
        setShowSetupBackendAlert(true);
      }
    } catch (err) {
      message.error("Failed to ping backend");
    }
  };

  useEffect(() => {
    if (healthy) {
      getUsers();
    }
  }, [healthy]);

  if (loading || !healthy) {
    return <Loading />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '1100px',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px',
          flexWrap: 'wrap-reverse',
        }}
      >
        <div style={{ flex: '1 1 450px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <h1
              style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              JasmineGraph
            </h1>
          </div>

          {showSetupBackendAlert && (
            <Alert
              message="No Admin Account Found"
              description="It looks like this is a new installation. Click below to set up your administrator profile."
              type="warning"
              showIcon
              closable
              onClose={() => setShowSetupBackendAlert(false)}
              style={{ borderRadius: '12px', marginTop: '16px' }}
              action={
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    router.push('/setup');
                  }}
                  style={{ borderRadius: '6px' }}
                >
                  Go to Setup
                </Button>
              }
            />
          )}
        </div>

        <div style={{ flex: '1 1 380px', maxWidth: '440px', width: '100%' }}>
          <Card
            bordered={false}
            style={{
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
              border: '1px solid #e2e8f0',
              padding: '12px 8px',
            }}
          >
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Please sign in to access your account
              </p>
            </div>
            <LoginForm />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;

