'use client';
import React, { useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Col, Divider, message, Row, Typography, Upload } from 'antd';
import kafkaLOGO from "@/assets/images/kafka-logo.jpg"
import hadoopLOGO from "@/assets/images/hadoop-logo.jpg"
import Image from "next/image";
import KafkaUploadModal from "@/components/graph-panel/kafka-upload-modal";
import HadoopUploadModal from "@/components/graph-panel/hadoop-upload-modal";

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: false,
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function GraphUpload() {
  const [kafkaModalOpen, setKafkaModelOpen] = useState<boolean>(false);
  const [hadoopModalOpen, setHadoopModelOpen] = useState<boolean>(false);


  const handleUpload = () => {
    message.success('Upload successful');
  }

  return (
    <div className="graph-upload-panel">
      <Typography.Title level={4} style={{margin: "20px 0px"}}>Upload Graph Data:</Typography.Title>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
    </Dragger>
    <Button type="primary" style={{margin: "20px 0px", width: "100%"}} onClick={handleUpload}>
      Upload
    </Button>
    <Divider  >or</Divider>
    <Row className="external-upload">
      <Col xs={20} sm={16} md={12} lg={12} xl={12}>
        <div className="upload-card" onClick={()=> setKafkaModelOpen(true)}>
          <Image src={kafkaLOGO} width={200} alt="Apache Kafka"/>
        </div>
      </Col>
      <Col xs={20} sm={16} md={12} lg={12} xl={12}>
        <div className="upload-card" onClick={()=> setHadoopModelOpen(true)}>
          <Image src={hadoopLOGO} width={200} alt="Hadoop HDFS"/>
        </div>
      </Col>
    </Row> 
    <KafkaUploadModal open={kafkaModalOpen} setOpen={(state: boolean) => setKafkaModelOpen(state)} />
    <HadoopUploadModal open={hadoopModalOpen} setOpen={(state: boolean) => setHadoopModelOpen(state)} />
  </div>
  );
}
