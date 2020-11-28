import React from 'react';
import Link from './../general/Link';
import { Typography } from 'antd';
import { formatDate } from './../../../helpers/formatDate';
import Image from './../general/ImageWithFallback';

const SorterHistoryItem = ({ data }) => {
    return (
        <Link to={`/results/${data._id}`}>
            <div className='sorter-history-item'>
                <div className='sorter-history-item-img'>
                    <Image width='200' height='100' src={data.sorter_img} crossOrigin='anonymous'></Image>
                </div>
                <div className='sorter-history-item-right'>
                    <div className='sorter-history-item-title'>
                        <Typography.Title level={5}>{data.sorter_name}</Typography.Title>
                    </div>
                    <div className='sorter-history-item-date'>
                        <Typography.Text type='secondary'>{formatDate(new Date(data.created_date), true)}</Typography.Text>
                    </div>
                </div>
            </div>
        </Link>
    );
};

SorterHistoryItem.Skeleton = () => {
    return <div className='sorter-history-item'></div>;
};

export default SorterHistoryItem;
