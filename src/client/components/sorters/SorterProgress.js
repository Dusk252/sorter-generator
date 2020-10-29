import React from 'react';
import { Row, Col, Progress } from 'antd';

const SorterProgress = ({ progress, total }) => {
    return (
        <Row justify='center'>
            <Col sm={24} md={21} lg={18} xl={15}>
                <Progress percent={Math.round((progress * 100) / total)} status={'normal'} />
            </Col>
        </Row>
    );
};

export default SorterProgress;
