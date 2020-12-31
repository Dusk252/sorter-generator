import React from 'react';
import { Col, Row } from 'antd';
import SorterHistoryItem from './SorterHistoryItem';

const SorterHistoryListing = ({ items, results }) => (
    <Row className='sorter-history' gutter={'10'}>
        {items &&
            items.map((res, index) => (
                <Col key={index} span={24} lg={12}>
                    {results[res._id] ? <SorterHistoryItem data={results[res._id]} /> : <SorterHistoryItem.Skeleton />}
                </Col>
            ))}
    </Row>
);

export default SorterHistoryListing;
