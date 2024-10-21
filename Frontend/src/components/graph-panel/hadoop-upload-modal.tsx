'use client';
import React from 'react';
import { Modal } from 'antd';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HadoopUploadModal = ({open, setOpen}:Props) => {
  const handleOk = () => {  
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal title="Hadoop HDFS" open={open} onOk={handleOk} onCancel={handleCancel}>
        <p>Not Implemented</p>
      </Modal>
    </>
  );
};

export default HadoopUploadModal;