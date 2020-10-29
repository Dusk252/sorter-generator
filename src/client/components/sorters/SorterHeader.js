import React from 'react';
import { Row, Col, Typography } from 'antd';
import Image from './../general/ImageWithFallback';

const SorterHeader = ({ sorterName, sorterLogo, className, user }) => {
    return (
        <Row className={className} justify='center'>
            <Col sm={24} md={21} lg={18} xl={15}>
                <Image src={sorterLogo} />
                <Typography.Title level={2} style={{ textAlign: 'center' }}>
                    {sorterName}
                </Typography.Title>
            </Col>
        </Row>
    );
};

export default SorterHeader;
