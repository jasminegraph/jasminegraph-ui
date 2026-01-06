/**
Copyright 2026 JasmineGraph Team
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

import React from "react";
import { Alert, List, Typography, Empty, Button, Badge, Dropdown, Space } from "antd";
import { BugOutlined, ClearOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import {
  toggle_activity_panel,
  clear_all_errors,
} from "@/redux/features/activityData";
import styles from "./ActivityPanel.module.css";

const { Text } = Typography;

interface ActivityPanelProps {
  featureName?: string;
}

export default function ActivityPanel({ featureName }: ActivityPanelProps) {
  const dispatch = useAppDispatch();
  const { errors, isPanelOpen } = useAppSelector((state) => state.activityData);

  const filteredErrors = featureName
    ? errors.filter((error) => error.menuItem === featureName)
    : errors;

  const hasErrors = filteredErrors.length > 0;

  const handleTogglePanel = () => {
    dispatch(toggle_activity_panel());
  };

  const handleClearAll = () => {
    dispatch(clear_all_errors());
  };

  const menuItems = [
    {
      key: "clear-all",
      label: "Clear All",
      icon: <ClearOutlined />,
      onClick: handleClearAll,
      disabled: filteredErrors.length === 0,
      danger: true,
    },
  ];

  return (
    <>
      {/* Toggle button fixed to bottom-left inside the white content box */}
      <div className={styles.toggleButtonContainer}>
        <Space>
          <Button
            type={hasErrors ? "primary" : "default"}
            shape="round"
            size="small"
            icon={<BugOutlined />}
            onClick={handleTogglePanel}
            className={styles.toggleButton}
          >
            Activity Panel
            {hasErrors && (
              <Badge
                count={filteredErrors.length}
                style={{ backgroundColor: "#ff4d4f", marginLeft: 8 }}
              />
            )}
          </Button>
          {hasErrors && (
            <Dropdown
              menu={{ items: menuItems }}
              placement="topRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                className={styles.clearButton}
              />
            </Dropdown>
          )}
        </Space>
      </div>

      {/* Dim the underlying content when the panel is open */}
      {isPanelOpen && (
        <div className={styles.overlay} />
      )}

      {/* Right-side overlay panel spanning the white content height */}
      {isPanelOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <BugOutlined style={{ color: "#ff4d4f" }} />
              <Text strong>
                Activity Panel{featureName ? ` – ${featureName}` : " (All)"}
              </Text>
              {hasErrors && (
                <Badge
                  count={filteredErrors.length}
                  style={{ backgroundColor: "#ff4d4f" }}
                />
              )}
            </div>
            <Button type="text" size="small" onClick={handleTogglePanel}>
              Close
            </Button>
          </div>

          {!hasErrors ? (
            <Empty description="No activity for this section" />
          ) : (
            <List
              size="small"
              dataSource={filteredErrors}
              className={styles.errorList}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  className={styles.errorItem}
                >
                  <Alert
                    type="error"
                    showIcon
                    message={
                      <div className={styles.errorHeader}>
                        <div className={styles.errorTitleContainer}>
                          <Text strong>{item.title}</Text>
                          {!featureName && (
                            <div className={styles.errorMenuItem}>
                              <Text type="secondary">
                                {item.menuItem}
                              </Text>
                            </div>
                          )}
                        </div>
                        <Text
                          type="secondary"
                          className={styles.errorTimestamp}
                        >
                          {item.time}
                        </Text>
                      </div>
                    }
                    description={item.message}
                    className={styles.errorAlert}
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
