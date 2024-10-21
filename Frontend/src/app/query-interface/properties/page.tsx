"use client";
import React, { useState, useEffect } from "react";
import {
  theme,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
} from 'antd';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Analyzers, GraphAnalyzer, InputParam, InputTypes } from "@/data/analyze-data";
import { getGraphList } from "@/services/graph-service";
import { ISelectProp } from "@/types/user-types";
import type { FormProps } from 'antd';
import { analyzeGraph } from "@/services/analyzer-service";

// Render input field based on InputTypes
const renderInputField = (key: string, inputParam: InputParam) => {
  switch (inputParam.type) {
    case InputTypes.INPUT:
      return (
        <Form.Item label={inputParam.label || key} name={key}>
          <Input />
        </Form.Item>
      );
    case InputTypes.INPUTNUMBER:
      return (
        <Form.Item label={inputParam.label || key} name={key}>
          <InputNumber />
        </Form.Item>
      );
    case InputTypes.SWITCH:
      return (
        <Form.Item label={inputParam.label || key} name={key} valuePropName="checked">
          <Switch />
        </Form.Item>
      );
    case InputTypes.SELECT:
      return (
        <Form.Item label={inputParam.label || key} name={key}>
          <Select>
            {inputParam.options?.map((option, index) => (
              <Select.Option key={index} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      );
    default:
      return null;
  }
};

export default function QueryPropoerties() {
  const { token } = theme.useToken();

  const [graphs, setGraphs] = useState<ISelectProp[]>([]);
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<GraphAnalyzer>();

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
    graph_id?: string;
    method?: string;
  };

  const runAnalysis = async (values: any) => {
    console.log("::values::", values)
    const result = await analyzeGraph(values);
    if (result.data) {
      message.success("Analysis completed successfully");
    } else {
      message.error(result.message);
    }
    setIsAnalysing(false);
  }
  
  const onValueChange = (param: any) => {
    if (param && param.method) {
      const tool = Analyzers.find((tool) => tool.name == param.method || tool.id == param.method)
      setSelectedTool(tool);
      console.log(param)
    }
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setIsAnalysing(true);
    await runAnalysis(values);
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
        onChange={(e) => console.log(e)}
        onValuesChange={onValueChange}
      >
        <Form.Item<FieldType> label="Graph" name="graph_id" rules={[{ required: true, message: 'Please select graph' }]}>
          <Select>
            {graphs.map((option, index) => (
              <Select.Option key={index} value={option.value}>
                {`${option.value} | ${option.label}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item<FieldType> label="Analysis" name="method"
          rules={[{ required: true, message: 'Please select analysing method!' }]}>
          <Select>
            {Analyzers.map((option, index) => (
              <Select.Option key={index} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {selectedTool && Object.keys(selectedTool.inputParameters).map((key) => (
          <div key={key}>
            {renderInputField(key, selectedTool.inputParameters[key])}
          </div>
        ))}
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{minWidth: "150px"}}>
            Run
          </Button>
      </Form.Item>

      </Form>
      {isAnalysing && (
      <Box sx={{ width: '100%', display: "flex", flexDirection: "column"}}>
        <LinearProgress />
        <Button color="danger" variant="filled">
          Cancel
        </Button>
      </Box>
      )}
      <div style={listStyle}>Result</div>
    </>
  );
}
