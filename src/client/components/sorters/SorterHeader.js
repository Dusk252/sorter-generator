import React from 'react';
import { Row, Col, Typography } from 'antd';
import Image from './../general/ImageWithFallback';
import UserBadge from './../users/UserBadge';

const SorterHeader = ({ sorterName, sorterLogo, className, user }) => {
    return (
        <Row className={className} justify='center'>
            <Col sm={24} md={21} lg={18} xl={15}>
                <Image src={sorterLogo} crossOrigin='anonymous' />
                <Typography.Title level={2} style={{ textAlign: 'center', marginTop: '0.5em' }}>
                    {sorterName}
                </Typography.Title>
                <UserBadge userId={user.id} icon={user.icon} username={user.username} size={32} prefix='by' />
            </Col>
        </Row>
    );
};

export default SorterHeader;
