import React from 'react';
import { Avatar, Typography } from 'antd';
import { formatDate } from '../../../helpers/formatDate';
import { UserOutlined } from '@ant-design/icons';

const UserBadge = ({ userInfo, date }) => (
    <div className='user-result'>
        {userInfo && userInfo.username && date ? (
            <>
                <Avatar
                    className='user-result-avatar'
                    shape='square'
                    size={24}
                    icon={<UserOutlined />}
                    src={userInfo.icon}
                />
                <Typography.Text type='secondary'>{`${userInfo.username} on ${formatDate(
                    new Date(date),
                    true
                )}`}</Typography.Text>
            </>
        ) : (
            ''
        )}
    </div>
);

export default UserBadge;
