import React from 'react';
import Link from '../general/Link';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserBadgeWrapper = ({ userId, children }) => (userId ? <Link to={`/users/${userId}`}>{children}</Link> : { children });

const UserBadge = ({ size, username, icon, userId, prefix }) => (
    <div className='user-badge'>
        {username ? (
            <UserBadgeWrapper userId={userId}>
                {prefix && <Typography.Text type='secondary'>{prefix}</Typography.Text>}
                <Avatar className='user-badge-avatar' shape='square' size={size ?? 36} icon={<UserOutlined />} src={icon} />
                <Typography.Text type='secondary'>{username}</Typography.Text>
            </UserBadgeWrapper>
        ) : (
            ''
        )}
    </div>
);

export default UserBadge;
