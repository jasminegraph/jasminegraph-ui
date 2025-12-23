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

import { useState } from "react";
import { Alert, List, Typography, Empty, Button, Badge } from "antd";
import { BugOutlined } from "@ant-design/icons";

const { Text } = Typography;

type ErrorItem = {
  id: string;
  title: string;
  message: string;
  time: string;
};

interface ErrorConsoleProps {
  featureName: string;
  errors: ErrorItem[];
}

export default function ErrorConsole({
  featureName,
  errors,
}: ErrorConsoleProps) {
  const hasErrors = errors.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button fixed to bottom-left inside the white content box */}
      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          zIndex: 3,
        }}
      >
        <Button
          type={hasErrors ? "primary" : "default"}
          shape="round"
          size="small"
          icon={<BugOutlined />}
          onClick={() => setOpen((prev) => !prev)}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Activity panel
          {hasErrors && (
            <Badge
              count={errors.length}
              style={{ backgroundColor: "#ff4d4f", marginLeft: 8 }}
            />
          )}
        </Button>
      </div>

      {/* Dim the underlying content when the panel is open */}
      {open && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            borderRadius: 8,
            zIndex: 1,
          }}
        />
      )}

      {/* Right-side overlay panel spanning the white content height */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            bottom: 16,
            width: 320,
            maxWidth: "40%",
            borderLeft: "1px solid #f0f0f0",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#fff",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.06)",
            zIndex: 2,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BugOutlined style={{ color: "#ff4d4f" }} />
              <Text strong>Activity Panel – {featureName}</Text>
            </div>
            <Button type="text" size="small" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>

          {!hasErrors ? (
            <Empty description="No activity for this section" />
          ) : (
            <List
              size="small"
              dataSource={errors}
              style={{ overflowY: "auto", flex: 1 }}
              renderItem={(item) => (
                <List.Item>
                  <Alert
                    type="error"
                    showIcon
                    message={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text strong>{item.title}</Text>
                        <Text
                          type="secondary"
                          style={{ marginLeft: 8, fontSize: 12 }}
                        >
                          {item.time}
                        </Text>
                      </div>
                    }
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      )}
    </>
  );
}
