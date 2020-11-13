import React from 'react';
import { connect } from 'react-redux';
import { Button, Space, Divider, Row, Col, Typography, Skeleton } from 'antd';
import Image from './../components/general/ImageWithFallback';
import SorterHistoryItem from './../components/users/SorterHistoryItem';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import { formatDate } from './../../helpers/formatDate';

const ProfilePage = ({ user, sorterResults }) => {
    return (
        user &&
        user.profile && (
            <LayoutBlockWrapper>
                <Space size='large' direction='vertical' style={{ width: '100%' }}>
                    <Divider orientation='left'>{user.profile.username}'s Profile</Divider>
                    <div className='user-info'>
                        <div className='user-info-img'>
                            <Image src={user.profile.icon} />
                        </div>
                        <div className='user-info-misc'>
                            <Typography.Paragraph>
                                <Typography.Title level={5}>Joined Date: </Typography.Title>
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                <Typography.Text type='primary'>
                                    {formatDate(new Date(user.joined_date), false)}
                                </Typography.Text>
                            </Typography.Paragraph>
                        </div>
                    </div>
                    <Divider orientation='left'>Sorter History</Divider>
                    <Row className='sorter-history' gutter={'10'}>
                        {user.sorter_history &&
                            user.sorter_history.map((res, index) => (
                                <Col key={index} span={12}>
                                    {sorterResults[res._id] ? (
                                        <SorterHistoryItem data={sorterResults[res._id]} />
                                    ) : (
                                        <SorterHistoryItem.Skeleton />
                                    )}
                                </Col>
                            ))}
                    </Row>
                </Space>
            </LayoutBlockWrapper>
        )
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser,
    sorterResults: state.results.resultsList
});

export default connect(mapStateToProps)(ProfilePage);
