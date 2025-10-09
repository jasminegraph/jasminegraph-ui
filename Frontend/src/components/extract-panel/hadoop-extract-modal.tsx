'use client';
import React, { useState } from 'react';
import { Modal, List, Checkbox, Button } from 'antd';
import HadoopKgForm from "@/components/extract-panel/haddop-kg-form";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const HadoopExtractModal = ({ open, setOpen }: Props) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const handleOk = () => {
        console.log('Selected files:', selectedFiles);


        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            ip: { value: string };
            port: { value: string };
        };
        const ip = target.ip.value;
        const port = target.port.value;
        const clusterId = localStorage.getItem('selectedCluster') || '';

        const res = await fetch(`backend/graph/hadoop?ip=${encodeURIComponent(ip)}&port=${encodeURIComponent(port)}`, {
            method: 'GET',
            headers: { 'Cluster-ID': clusterId }
        });
        const data = await res.json();
        setFileNames(data);
    };

    const toggleFile = (file: string) => {
        setSelectedFiles(prev =>
            prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
        );
    };

    return (
        <Modal title="Hadoop HDFS" open={open} onOk={handleOk} onCancel={handleCancel} footer={[
            <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
            // <Button key="ok" type="primary" onClick={handleOk}>OK</Button>
        ]}>
            <HadoopKgForm onSuccess={()=>  setOpen(false)}/>

        </Modal>
    );
};

export default HadoopExtractModal;