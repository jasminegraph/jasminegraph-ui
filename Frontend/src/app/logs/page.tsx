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

import React, { useState, useEffect } from "react";
import PageWrapper from "@/layouts/page-wrapper";
import { LOKI_EXPLORE } from "@/properties";
import styles from "./logs.module.css";

export default function LogsPage() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        await fetch(LOKI_EXPLORE.url, { method: "HEAD", mode: "no-cors" });
        setIsAvailable(true);
      } catch (error: any) {
        // CORS errors mean service is likely running but blocked
        if (
          error.message &&
          (error.message.includes("CORS") ||
            error.message.includes("Load failed") ||
            error.message.includes("TypeError"))
        ) {
          setIsAvailable(true); // Service running, CORS blocking
        } else {
          setIsAvailable(false); // Network error, service down
        }
      }
    };
    checkAvailability();
  }, []);

  if (isAvailable === null) {
    return (
      <PageWrapper>
        <div className={styles.container}>
          <p>Checking logs availability...</p>
        </div>
      </PageWrapper>
    );
  }

  if (isAvailable === false) {
    return (
      <PageWrapper>
        <div className={styles.container}>
          <p>
            Logs explorer is currently unavailable. Please check if the Loki
            service is running.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className={styles.iframeContainer}>
        <iframe
          src={LOKI_EXPLORE.url}
          className={styles.iframe}
          title="Loki Logs Explorer"
          style={{ border: "none", width: "100%", height: "100%" }}
        />
      </div>
    </PageWrapper>
  );
}
