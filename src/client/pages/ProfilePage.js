import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Space, Divider, Typography } from 'antd';
import { getSelf } from '../store/users/usersActions';
import Image from './../components/general/ImageWithFallback';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import { formatDate } from './../../helpers/formatDate';
import Link from './../components/general/Link';
import SorterHistoryListing from '../components/sorterResults/SorterHistoryListing';

const ProfilePage = ({ user, sorterResults, getSelf }) => {
    useEffect(() => {
        getSelf();
    }, []);
    return (
        <>
            <Helmet>
                <title>{`Profile${user && user.profile ? ` - ${user.profile.username}` : ''}`}</title>
            </Helmet>
            {user && user.profile && (
                <LayoutBlockWrapper>
                    <Space size='large' direction='vertical' style={{ width: '100%' }}>
                        <Divider orientation='left'>{user.profile.username}'s Profile</Divider>
                        <div className='user-info'>
                            <div className='user-info-img'>
                                <Image src={user.profile.icon} crossOrigin='anonymous' />
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
                        <SorterHistoryListing items={user.sorter_history} results={sorterResults} />
                        <Link to='/results/history' style={{ display: 'block', textAlign: 'center' }}>
                            View More
                        </Link>
                    </Space>
                </LayoutBlockWrapper>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser,
    sorterResults: state.results.resultsList
});

const mapDispatchToProps = {
    getSelf
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
