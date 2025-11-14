"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "@/layouts/page-wrapper";

export default function PerformancePage() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dashboardUID, setDashboardUID] = useState<string | null>(null);

  useEffect(() => {
    const savedUID = localStorage.getItem('grafanaDashboardUID');
    console.log("[Frontend] localStorage grafanaDashboardUID:", savedUID);

    if (savedUID) {
      setDashboardUID(savedUID);
      setSetupStatus('success');
      return;
    }

    const setupGrafana = async () => {
      setSetupStatus('loading');
      try {
        const res = await fetch('/backend/grafana/setup', { method: 'POST' });
        const data = await res.json();

        if (res.ok && data.uid) {
          localStorage.setItem('grafanaDashboardUID', data.uid);
          setDashboardUID(data.uid);
          setSetupStatus('success');
        } else {
          setSetupStatus('error');
          setErrorMessage(data.message || 'Setup failed');
        }
      } catch (error) {
        console.error("[Frontend] Could not connect to backend:", error);
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

  const dashboardUrl = `http://20.40.46.214:3001/d/${dashboardUID}`;

  return (
    <PageWrapper>
      <div style={{ height: 'calc(100vh - 64px)', width: '100%', padding: 4 }}>
        <iframe
          src={dashboardUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Grafana Dashboard"
        />
      </div>
    </PageWrapper>
  );
}
