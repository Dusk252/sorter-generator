import React from 'react';
import { Space, Row, Col, Button, Typography } from 'antd';
import * as htmlToImage from 'html-to-image';
import Image from './../general/ImageWithFallback';
import SorterHeader from './../sorters/SorterHeader';

const toUrlSlug = (s) =>
    s
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w-]+/g, '');

const downloadImageResults = (sorterName) => {
    const pageLayout = document.getElementsByTagName('main')[0];
    htmlToImage
        .toJpeg(pageLayout, {
            quality: 0.95,
            backgroundColor: '#131313',
            filter: (node) => {
                return !(node.classList && node.classList.contains('control-buttons'));
            }
        })
        .then(function (dataUrl) {
            const date = new Date();
            let link = document.createElement('a');
            link.download = `${toUrlSlug(
                sorterName
            )}_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
            link.href = dataUrl;
            link.click();
        });
};

const SorterResults = ({ results, ties, characters, groups, sorterName, sorterLogo }) => {
    let counter = 1;
    let limit = 0;

    return (
        <Space size='large' direction='vertical' style={{ width: '100%' }}>
            <SorterHeader sorterName={sorterName} sorterLogo={sorterLogo} className='sorter-header' />
            <Row className='control-buttons' justify='center'>
                <Col sm={8} md={7} lg={6} xl={5} style={{ textAlign: 'center' }}>
                    <Button type='primary' htmlType='button'>
                        Save Results
                    </Button>
                </Col>
                <Col sm={8} md={7} lg={6} xl={5} style={{ textAlign: 'center' }}>
                    <Button type='primary' htmlType='button' onClick={() => downloadImageResults(sorterName)}>
                        Download as Image
                    </Button>
                </Col>
            </Row>
            {Array.isArray(results) ? (
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
                            <div className='sorter-results-item' key={char}>
                                <div className={`sorter-results-rank sorter-results-rank-${type}`}>
                                    <div className='sorter-results-rank-bottom'></div>
                                    <div className='sorter-results-rank-top'>{counter}</div>
                                </div>
                                <div className='sorter-results-img'>
                                    <Image src={characters[char].picture} />
                                </div>
                                <div className='sorter-results-name'>
                                    <div className='chara-form-text chara-form-text-name'>
                                        <Typography.Title level={5} style={{ display: 'inline' }}>
                                            {' '}
                                            {characters[char].name}
                                        </Typography.Title>
                                    </div>
                                    {characters[char].group != null && (
                                        <div className='chara-form-text chara-form-text-group'>
                                            <i>{groups[characters[char].group].name}</i>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className='sorter-results-group-color'
                                    style={{
                                        background:
                                            groups[characters[char].group] != null
                                                ? groups[characters[char].group].color
                                                : 'rgba(255, 255, 255, 0.5)'
                                    }}
                                ></div>
                            </div>
                        );
                    })}
                </Space>
            ) : (
                <></>
            )}
        </Space>
    );
};

export default SorterResults;
