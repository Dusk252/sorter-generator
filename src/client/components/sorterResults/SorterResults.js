import React from 'react';
import { Space, Typography } from 'antd';
import Image from '../general/ImageWithFallback';

const SorterResults = ({ results, ties, items, groups, handleMouseOver, handleMouseOut, refs }) => {
    let counter = 1;
    let limit = 0;

    return Array.isArray(results) ? (
        <Space id='sorterResults' className='sorter-results' size='middle' direction='vertical'>
            {results.map((char, index) => {
                if (index > limit) {
                    counter = index + 1;
                    limit = 0;
                }
                if (ties[char]) {
                    limit = limit === 0 ? index + ties[char] : limit + ties[char];
                }
                let type = counter === 1 ? 'gold' : counter === 2 ? 'silver' : counter === 3 ? 'bronze' : 'flat';
                return (
                    <div
                        className='sorter-results-item'
                        key={char}
                        ref={refs[char]}
                        onMouseOver={() => handleMouseOver(char)}
                        onMouseOut={() => handleMouseOut(char)}
                    >
                        <div className={`sorter-results-rank sorter-results-rank-${type}`}>
                            <div className='sorter-results-rank-bottom'></div>
                            <div className='sorter-results-rank-top'>{counter}</div>
                        </div>
                        <div className='sorter-results-img'>
                            <Image src={items[char].picture} crossOrigin='anonymous' />
                        </div>
                        <div className='sorter-results-name'>
                            <div className='item-form-text item-form-text-name'>
                                <Typography.Title level={5} style={{ display: 'inline' }}>
                                    {' '}
                                    {items[char].name}
                                </Typography.Title>
                            </div>
                            {items[char].group != null && (
                                <div className='item-form-text item-form-text-group'>
                                    <i>{groups[items[char].group].name}</i>
                                </div>
                            )}
                        </div>
                        <div
                            className='sorter-results-group-color'
                            style={{
                                background:
                                    groups[items[char].group] != null
                                        ? groups[items[char].group].color
                                        : 'rgba(255, 255, 255, 0.5)'
                            }}
                        ></div>
                    </div>
                );
            })}
        </Space>
    ) : (
        <></>
    );
};

export default SorterResults;
