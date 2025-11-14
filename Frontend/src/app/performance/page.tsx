"use client";
import React, { useEffect, useState } from "react";
import PageWrapper from "@/layouts/page-wrapper";

const GRAFANA_DASHBOARD_URL = "http://20.40.46.214:3001/d/your-dashboard-uid";

export default function PerformancePage() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const setupDone = localStorage.getItem('grafanaSetupDone');
    if (setupDone === 'true') {
      setSetupStatus('success');
      return;
    }

    const setupGrafana = async () => {
      setSetupStatus('loading');
      try {
        const res = await fetch('/grafana/setup', { method: 'POST' });
        const data = await res.json();

        if (res.ok) {
          setSetupStatus('success');
          localStorage.setItem('grafanaSetupDone', 'true');
        } else {
          setSetupStatus('error');
          setErrorMessage(data.message || 'Setup failed');
        }
      } catch (e) {
        setSetupStatus('error');
        setErrorMessage('Could not connect to backend');
      }
    };

    setupGrafana();
  }, []);

  if (setupStatus === 'loading' || setupStatus === 'idle') {
    return (
      <PageWrapper>
        <p>Setting up performance dashboard, please wait...</p>
      </PageWrapper>
    );
  }

  if (setupStatus === 'error') {
    return (
      <PageWrapper>
        <div>
          <p>Unable to setup Grafana dashboard: {errorMessage}</p>
          <p>You can still use the system without performance monitoring.</p>
        </div>
      </PageWrapper>
    );
  }

  // setupStatus === 'success'
  return (
    <PageWrapper>
      <div style={{ flex: 1, height: "calc(100vh - 64px)", marginLeft: 200 }}>
        {/* 
          Assuming:
          - Header height = 64px (Ant Design default)
          - SideMenu width = 200px
          Adjust these as per your actual styles.
        */}
        <iframe
          src={GRAFANA_DASHBOARD_URL}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Grafana Performance Dashboard"
        />
      </div>
    </PageWrapper>
  );
}
