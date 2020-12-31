import React from 'react';
import Link from '../general/Link';
import { Typography } from 'antd';
import { formatDate } from '../../../helpers/formatDate';
import Image from '../general/ImageWithFallback';
import UserBadge from '../users/UserBadge';

const SorterHistoryItem = ({ data }) => {
    return (
        <div className='sorter-history-item'>
            <Link to={`/results/${data._id}`} style={{ display: 'flex' }}>
                <div className='sorter-history-item-img'>
                    <Image width='200' height='100' src={data.sorter_img} crossOrigin='anonymous'></Image>
                </div>
                <div className='sorter-history-item-center'>
                    <div className='sorter-history-item-title'>
                        <Typography.Title level={5}>{data.sorter_name}</Typography.Title>
                    </div>
                    <div className='sorter-history-item-date'>
                        <Typography.Text type='secondary'>
                            {formatDate(new Date(data.created_date), true, false)}
                        </Typography.Text>
                    </div>
                </div>
            </Link>
            <div className='sorter-history-item-right'>
                <UserBadge
                    size={24}
                    username={data.user_info.username}
                    icon={data.user_info.icon}
                    userId={data.user_info.id}
                />
            </div>
        </div>
    );
};

SorterHistoryItem.Skeleton = () => {
    return <div className='sorter-history-item'></div>;
};

export default SorterHistoryItem;
