/**
 * HDFS Knowledge Graph Construction Form
 * Collects only HDFS + LLM details
 */

import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Select, message, Alert } from 'antd';
import useAccessToken from '@/hooks/useAccessToken';
import { constructKG } from "@/services/graph-service";

const { Option } = Select;

const HadoopKgForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    const { getSrvAccessToken } = useAccessToken();

    const onFinish = async (values: any) => {
        setLoading(true);
        setFormError(null); // clear previous error
        try {
            const token = getSrvAccessToken() || "";

            // Flatten runners by chunks
            const llmRunnerString = values.llmAllocations
                .map((r: { runner: string; chunks: number }) => Array(r.chunks).fill(r.runner))
                .flat()
                .join(',');

            await constructKG(
                values.hdfsIp,
                values.hdfsPort,
                values.hdfsFilePath,
                llmRunnerString,
                values.inferenceEngine,
                values.model,
                values.chunkSize
            );

            message.success("Knowledge Graph construction started");
            onSuccess();
        } catch (err: any) {
            console.error(err);

            // Detect HTTP 400 and show inline form error
            if (err.response?.status === 400) {
                const msg = err.response?.data?.errorDetails.errorMsg || "Bad request. Please check your inputs.";
                setFormError(msg);
            } else {
                // For other errors, show global toast
                message.error("Failed to start HDFS Knowledge Graph");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name="hdfs-kg-form"
            onFinish={onFinish}
            style={{ maxWidth: 600, margin: "0 auto" }}
        >
            {/* 🔴 Inline Error Alert */}


            {/* HDFS Config */}
            <Form.Item
                name="hdfsIp"
                label="HDFS Server IP"
                rules={[{ required: true, message: "Please enter HDFS server IP" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="hdfsPort"
                label="HDFS Server Port"
                rules={[{ required: true, message: "Please enter HDFS server port" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="hdfsFilePath"
                label="HDFS File Path"
                rules={[{ required: true, message: "Please enter HDFS file path" }]}
            >
                <Input placeholder="/path/to/hdfs/file" />
            </Form.Item>

            {/* LLM Config */}
            <Form.Item label="LLM Inference Engine Location">
                <Form.List
                    name="llmAllocations"
                    initialValue={[{ runner: '', chunks: 1 }]} // <-- Add default one row
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'runner']}
                                        rules={[{ required: true, message: 'Enter LLM Runner IP:PORT' }]}
                                        style={{ flex: 2 }}
                                    >
                                        <Input placeholder="LLM Runner IP:PORT" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'chunks']}
                                        rules={[{ required: true, message: 'Enter number of chunks' }]}
                                        style={{ flex: 1 }}
                                    >
                                        <InputNumber
                                            min={1}
                                            step={1}
                                            placeholder="Chunks"
                                            style={{ width: '100%' }}
                                            onKeyDown={(e) => {
                                                if (
                                                    ['e', 'E', '+', '-', '.', ',', ' '].includes(e.key) ||
                                                    ((e.key < '0' || e.key > '9') &&
                                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key))
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Item>

                                    <Button type="link" danger onClick={() => remove(name)}>
                                        Remove
                                    </Button>
                                </div>
                            ))}

                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    Add LLM Engine Location
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>


            <Form.Item
                name="inferenceEngine"
                label="LLM Inference Engine Category"
                rules={[{ required: true, message: "Please select inference engine" }]}
            >
                <Select>
                    <Option value="ollama">Ollama</Option>
                    <Option value="vllm">vLLM</Option>
                    <Option value="transformers">HuggingFace Transformers</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="model"
                label="Model Name"
                rules={[{ required: true, message: "Please enter LLM model" }]}
            >
                <Input placeholder="e.g., gemma3:12b-it, nomic-embed-text" />
            </Form.Item>

            <Form.Item
                name="chunkSize"
                label="Chunk Size"
                rules={[{ required: true, message: "Please enter chunk size" }]}
            >
                <InputNumber min={128} max={8192} style={{ width: "100%" }} />
            </Form.Item>
            {formError && (
                <Form.Item>
                    <Alert
                        message={formError}
                        // description={formError}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setFormError(null)}
                    />
                </Form.Item>
            )}
            {/* Submit */}
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Start Graph Construction
                </Button>
            </Form.Item>
        </Form>
    );
};

export default HadoopKgForm;
