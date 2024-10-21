"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ClusterData } from "@/data/cluster-data";
import { IClusterDetails } from "@/types/cluster-types";
import Highlighter from 'react-highlight-words';
import { Tag, Button, Modal, Input, Space, Table, Layout, theme, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { SearchProps } from "antd/es/input/Search";
import type { TableProps, PaginationProps } from 'antd';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import UserRegistrationForm from "@/components/cluster-details/user-registration-form";
import PageWrapper from "@/layouts/page-wrapper";
import { useAppSelector } from "@/redux/hook";
import { IUserAccessData } from "@/types/user-types";
import { getAllUsers } from "@/services/user-service";
import { set_Users_Cache } from "@/redux/features/cacheSlice";

const { Content } = Layout;

interface DataType {
  key: string;
  userID: string;
  Name: string;
  Email: string;
  Role: string;
  Status: boolean;
  [key: string]: string | boolean;
}

const PaginationProps = {
  pageSize: 5,
  defaultPageSize: 5,
  showSizeChanger: true,
  showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
} as PaginationProps;

export default function Clusters() {
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const { users, state } = useAppSelector(state => state.cacheData)
  const [userData, setUserData] = useState<IUserAccessData[]>(users);
  
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  // const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
  //   const filteredClusters = ClusterData.filter((cluster) => {
  //     return cluster.name.toLowerCase().includes(value.toLowerCase());
  //   });
  //   setClusters(filteredClusters);
  // }

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
        key: data._id,
        userID: data._id,
        Name: data.fullName,
        Email: data.email,
        Role: data.role,
        Status: data.enabled,
      };
    });
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

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
      ...getColumnSearchProps('Name')
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'email',
      ...getColumnSearchProps('Email')
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

  const fetchUserData = async () => {
    try{
      const res = await getAllUsers();
      if(res.data){
        setUserData(res.data)
        dispatch(set_Users_Cache(res.data))
      }
    }catch(err){
      console.log("Failed to fetch cluster")
    }
  }

  useEffect(()=> {
    if(!state.isUsersCacheLoaded){
      fetchUserData();
    }
  }, [state])

  const afterUserRegistration = () => {
    setOpenModal(false);
  }

  return (
    <PageWrapper>
      <Layout style={{ padding: "24px 24px", height: "92vh" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Modal
            title="Add New User"
            open={openModal}
            footer={<></>}
            onCancel={() => setOpenModal(false)}
          >
            <UserRegistrationForm onSuccess={afterUserRegistration}/>
          </Modal>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{marginBottom: "20px"}}>
              <h1 style={{fontSize: "xx-large", fontWeight: "600", lineHeight: "1.5"}}>User Management</h1>
              <p>Manage users, add new users and change user roles. This page provides role-based access control</p>
            </div>
            <Button size="large" onClick={showModal}>Add New User</Button>
          </div>
          <Table columns={columns} dataSource={getTableData()} pagination={PaginationProps}/>
        </Content>
      </Layout>
    </PageWrapper>
  );
}
