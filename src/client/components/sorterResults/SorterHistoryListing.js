import React from 'react';
import { Col, Row } from 'antd';
import SorterHistoryItem from './SorterHistoryItem';

const SorterHistoryListing = ({ items, results }) => {
    console.log(items, results);
    return (
        <Row className='sorter-history' gutter={'10'}>
            {items &&
                items.map((id, index) => (
                    <Col key={index} span={24} lg={12}>
                        {results[id] ? <SorterHistoryItem data={results[id]} /> : <SorterHistoryItem.Skeleton />}
                    </Col>
                ))}
        </Row>
    );
};

export default SorterHistoryListing;
