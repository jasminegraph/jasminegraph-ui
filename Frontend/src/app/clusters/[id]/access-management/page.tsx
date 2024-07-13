'use client';
import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal } from 'antd';
import type { TableProps, PaginationProps } from 'antd';
import { IClusterDetails } from "@/types/cluster-types";
import { ClusterData } from "@/data/cluster-data";
import { userData } from "@/data/user-data";
import UserRegistrationForm from "@/components/cluster-details/user-registration-form";

interface DataType {
  key: string;
  userID: string;
  Name: string;
  Email: string;
  Role: string;
  Status: boolean;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'UserID',
    dataIndex: 'userID',
    key: 'ID',
  },
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'Role',
    key: 'role',
  },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'status',
    render: (_, { Status }) => (
      <>
        {Status ? (
          <Tag color={'green'}>
            {"Active"}
          </Tag>) : (
          <Tag color={"volcano"}>
            {"Inactive"}
          </Tag>
        )}
      </>
    ),
  }
];

const PaginationProps = {
  pageSize: 5,
  defaultPageSize: 5,
  showSizeChanger: true,
  showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
} as PaginationProps;

export default function AccessManagement({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [clusterDetails, setClusterDetails] = useState<IClusterDetails>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const showModal = () => {
    setOpenModal(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpenModal(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpenModal(false);
  };

  const getTableData = () => {
    return userData.map((data) => {
      return {
        key: data.userID,
        userID: data.userID,
        Name: data.Name,
        Email: data.Email,
        Role: data.Role,
        Status: data.Status,
      };
    });
  }

  useEffect(()=>{
    const info = ClusterData.find((cluster) => cluster.clusterId === params.id);
    setClusterDetails(info);
    setLoading(false);
  },[params.id])

  return (
    <div className="">
      <Modal
        title="Add New User"
        open={openModal}
        footer={<></>}
        onCancel={() => setOpenModal(false)}
      >
        <UserRegistrationForm />
      </Modal>
      <div style={{margin: "20px 0px"}}>
        <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5"}}>User Management</h1>
        <p>Manage users, add new users and change user roles. This page provides role-based access control</p>
      </div>
      <Table columns={columns} dataSource={getTableData()} pagination={PaginationProps}/>
      <div className="flex w-full justify-end items-center">
        <Button size="large" onClick={showModal}>Add New User</Button>
      </div>
    </div>
  );
}
