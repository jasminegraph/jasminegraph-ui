"use client";
import React, { useState, useEffect } from "react";
import {
  theme,
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
  message,
} from 'antd';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { AnalyzeOptions } from "@/data/analyze-data";
import { getGraphList } from "@/services/graph-service";
import { DataType } from "@/app/graph-panel/graph/page";
import { ISelectProp } from "@/types/user-types";
import type { FormProps } from 'antd';

export default function QueryConsole() {
  const { token } = theme.useToken();

  const [graphs, setGraphs] = useState<ISelectProp[]>([]);
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);

  const getGraphsData = async () => {
    try{
    const res = await getGraphList();
    console.log("::res::", res)
    if(res.data){
      const filteredData: ISelectProp[] = res.data.map((graph: any) => {
         return {
          value: graph.idgraph,
          label: graph.name
        }
      })
      setGraphs(filteredData);
      console.log(filteredData)
    }
    }catch(err){
      message.error("Failed to fetch graphs");
    }
  }

  useEffect(() => {
    getGraphsData();
  }, [])

  const listStyle: React.CSSProperties = {
    lineHeight: '200px',
    textAlign: 'center',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };
  
  type FieldType = {
    graph?: string;
    method?: string;
  };
  
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setIsAnalysing(true);
    console.log('Success:', values);
  };

  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        size={"large"}
        style={{ maxWidth: 600, marginTop: "20px" }}
      >
        <Form.Item<FieldType> label="Graph" name="graph" rules={[{ required: true, message: 'Please select graph' }]}>
          <Select>
            {graphs.map((option, index) => (
              <Select.Option key={index} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<FieldType> label="Analysis" name="method"
          rules={[{ required: true, message: 'Please select analysing method!' }]}>
          <Select>
            {AnalyzeOptions.map((option, index) => (
              <Select.Option key={index} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{minWidth: "150px"}}>
            Run
          </Button>
      </Form.Item>
      </Form>
      {isAnalysing && (
      <Box sx={{ width: '100%', display: "flex" }}>
        <LinearProgress />
        <Button color="danger" variant="filled">
          Cancel
        </Button>
      </Box>
      )}
      <div style={listStyle}>Search Result List</div>
    </>
  );
}
