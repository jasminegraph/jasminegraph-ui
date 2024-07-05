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