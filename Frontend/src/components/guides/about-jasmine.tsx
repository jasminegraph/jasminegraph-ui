/**
Copyright 2024 JasmineGraph Team
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

import React from "react";
import {Anchor, Col, Row, Typography} from "antd";

const { Paragraph, Title } = Typography;

const AboutJasmine = () => {
  return (
    <Row >
    <Col span={20} style={{overflowY: "scroll"}}>
      <div id="part-1" >
          <Typography>
          <Title level={1}>About JasmineGraph</Title>
          <Paragraph>
          jasminegraph-ui is a web-based user interface for interacting with the JasmineGraph Distributed Graph Database Server. This application is built using Next.js to provide a responsive and efficient frontend experience.
          </Paragraph>
          </Typography>
      </div>
    </Col>
    <Col span={4}>
      <Anchor
        items={[
          {
            key: 'part-1',
            href: '#part-1',
            title: 'Part 1',
          },
          {
            key: 'part-2',
            href: '#part-2',
            title: 'Part 2',
          },
          {
            key: 'part-3',
            href: '#part-3',
            title: 'Part 3',
          },
        ]}
      />
    </Col>
  </Row>
  );
};

export default AboutJasmine;
