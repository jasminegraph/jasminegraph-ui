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

"use client";

import React, { useEffect, useState } from "react";
import PageWrapper from "@/layouts/page-wrapper";

export default function PerformancePage() {
  const dashboardUrl = "http://localhost:3001/d/beg67s27j6oe8b/jasminegraph-performance";
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDashboardAvailability = async () => {
      try {
        const response = await fetch(dashboardUrl, { method: "HEAD" });
        if (response.ok) {
          setIsAvailable(true);
        } else {
          setIsAvailable(false);
        }
      } catch (error) {
        setIsAvailable(false);
      }
    };
    checkDashboardAvailability();
  }, [dashboardUrl]);

  if (isAvailable === null) {
    return (
      <PageWrapper>
        <p>Checking performance dashboard availability</p>
      </PageWrapper>
    );
  }

  if (isAvailable === false) {
    return (
      <PageWrapper>
        <p>
          Performance dashboard is currently unavailable. Please check if the Grafana service is running.
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ height: "calc(100vh - 64px)", width: "100%", padding: 4 }}>
        <iframe
          src={dashboardUrl}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="Grafana Dashboard"
        />
      </div>
    </PageWrapper>
  );
}
