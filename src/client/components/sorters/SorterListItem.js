import React from 'react';
import Image from './../general/ImageWithFallback';
import Link from './../general/Link';
import { Typography, Tag } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const SorterListItem = ({ data, isFavorite, toggleFavorite }) => {
    return (
        <div className='sorter-list-item'>
            {data.info[0].picture ? (
                <div className='sorter-list-item-img'>
                    <Image width='200' height='100' src={data.info[0].picture} crossOrigin='anonymous' />
                </div>
            ) : (
                <></>
            )}
            <div className='sorter-list-item-center'>
                <Link className='sorter-list-item-title' to={`/sorters/${data._id}`}>
                    <Typography.Title level={5}>{data.info[0].name}</Typography.Title>
                </Link>
                <Typography.Text type='secondary' className='sorter-list-item-description'>
                    {data.info[0].description}
                </Typography.Text>
                <div className='sorter-list-item-tags'>
                    {data.info[0].tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;

                        const tagElem = (
                            <Tag className='tag' key={index} closable={false}>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </Tag>
                        );
                        return isLongTag ? (
                            <Tooltip title={tag} key={index}>
                                {tagElem}
                            </Tooltip>
                        ) : (
                            tagElem
                        );
                    })}
                </div>
            </div>
            <div className='sorter-list-item-right'>
                <div className='sorter-list-item-stats'>
                    <div>
                        <Typography.Text type='secondary'>taken </Typography.Text>
                        <b>{data.meta.times_taken}</b>
                        <Typography.Text type='secondary'>{` time${
                            data.meta.times_taken === 1 ? '' : 's'
                        }`}</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text type='secondary'>viewed </Typography.Text>
                        <b>{data.meta.views}</b>
                        <Typography.Text type='secondary'>{` time${data.meta.views === 1 ? '' : 's'}`}</Typography.Text>
                    </div>
                    <div>
                        <b>{data.meta.favorites}</b>
                        <Typography.Text type='secondary'> favorites</Typography.Text>
                    </div>
                </div>
                <div className='sorter-list-item-favorite'>
                    {isFavorite ? (
                        <HeartFilled onClick={toggleFavorite} color='primary' />
                    ) : (
                        <HeartOutlined onClick={toggleFavorite} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SorterListItem;
