import React from "react";
import { theme } from "antd";

interface SegmentedProgressProps {
    progress: number;   // 0–100
    segments?: number;  // number of boxes (default 20)
}

const SegmentedProgress: React.FC<SegmentedProgressProps> = ({ progress, segments = 50 }) => {
    const {
        token: { colorPrimary, colorBorder, colorBgContainer }
    } = theme.useToken();

    const filled = Math.round((progress / 100) * segments);

    return (
        <div
            style={{
                display: "flex",
                border: `1px solid ${colorBorder}`,
                borderRadius: 4,
                padding: "4px",
                width: "100%",
                justifyContent: "space-between",
                background: colorBgContainer,
            }}
        >
            {Array.from({ length: segments }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        flex: 1,
                        height: "75px",
                        margin: "0 2px",
                        backgroundColor: i < filled ? colorPrimary : "#f0f0f0",
                        borderRadius: 2,
                        transition: "background-color 0.3s ease",
                    }}
                />
            ))}
        </div>
    );
};

export default SegmentedProgress;
