import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { getSorterResult } from '../store/sorterResults/sorterResultsActions';
import { getSorter, getSorterVersion } from '../store/sorters/sortersActions';
import SorterResults from './../components/sorterResults/SorterResults';
import SorterUserResults from './../components/sorterResults/SorterUserResults';
import SorterHeader from './../components/sorters/SorterHeader';
import { Button, Row, Col, Input, Tooltip } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import * as htmlToImage from 'html-to-image';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import useSorterResults from './../hooks/useSorterResults';
import { getLatestResultBySorterId } from './../store/apiCalls';
import Link from './../components/general/Link';

const SorterResultsPage = ({
    results,
    sorters,
    getSorterResult,
    getSorter,
    getSorterVersion,
    accessToken,
    match,
    location
}) => {
    const resultId = match.params.id;
    const compareId = location.query ? location.query.compare : undefined;
    const [userLatest, setUserLatest] = useState(null);

    const [sorter, result, elRefs] = useSorterResults(
        sorters,
        results,
        resultId,
        getSorterResult,
        getSorter,
        getSorterVersion
    );
    const [sorter2, result2, elRefs2] = useSorterResults(
        sorters,
        results,
        compareId,
        getSorterResult,
        getSorter,
        getSorterVersion
    );

    const [urlCopied, setUrlCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!compareId && accessToken && result && !userLatest) {
            getLatestResultBySorterId(result.sorter_id, accessToken).then((res) => {
                if (res.data && result._id != res.data._id) {
                    setUserLatest(res.data._id);
                }
            });
        }
    }, [accessToken, result, compareId, userLatest]);

    const handleMouseOver = (id) => {
        elRefs[id].current.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        if (result2) elRefs2[id].current.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    };
    const handleMouseOut = (id) => {
        elRefs[id].current.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
        if (result2) elRefs2[id].current.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
    };

    const toUrlSlug = (s) =>
        s
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[-]+/g, '-')
            .replace(/[^\w-]+/g, '');

    const downloadImageResults = (sorterName) => {
        setDownloading(true);
        const pageLayout = document.getElementsByClassName('container')[0];
        htmlToImage
            .toJpeg(pageLayout, {
                quality: 0.95,
                backgroundColor: '#131313',
                filter: (node) => {
                    return !(node.classList && node.classList.contains('control-buttons'));
                },
                pixelRatio: window.devicePixelRatio ?? 1
            })
            .then(function (dataUrl) {
                const date = new Date();
                let link = document.createElement('a');
                link.download = `${toUrlSlug(sorterName)}_${date.getFullYear()}-${
                    date.getMonth() + 1
                }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
                link.href = dataUrl;
                link.click();
                setDownloading(false);
            });
    };

    return (
        <>
            <Helmet>
                <title>{`Sorter Results${result && sorter ? ` - ${sorter.name}` : ''}`}</title>
            </Helmet>
            {result && sorter ? (
                <LayoutBlockWrapper>
                    <div className='sorter-results-page'>
                        <SorterHeader
                            sorterName={sorter.name}
                            sorterLogo={sorter.picture}
                            className='sorter-header'
                            user={sorter.user_info}
                        />
                        {!compareId && userLatest ? (
                            <div className='sorter-results-compare'>
                                <Link to={`/results/${result._id}?compare=${userLatest}`}>
                                    <Button type='primary' htmlType='submit' block>
                                        Compare with your latest result
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            ''
                        )}
                        {location.query && location.query.share ? (
                            <>
                                <Row className='control-buttons' justify='center'>
                                    <Col sm={16} md={14} lg={12} xl={10} style={{ textAlign: 'center' }}>
                                        <div className='share-results'>
                                            <p>Share these results:</p>
                                            <Tooltip placement='right' title={urlCopied ? 'Url copied' : 'Copy the url'}>
                                                <div
                                                    style={{ display: 'flex', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            window.location.href.replace(location.search, '')
                                                        );
                                                        setUrlCopied(true);
                                                    }}
                                                >
                                                    <Input
                                                        value={window.location.href.replace(location.search, '')}
                                                        disabled
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    {urlCopied ? <CheckOutlined /> : <CopyOutlined />}
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='control-buttons' justify='center'>
                                    <Col sm={16} md={14} lg={12} xl={10} style={{ textAlign: 'center' }}>
                                        <Button
                                            type='primary'
                                            htmlType='button'
                                            onClick={() => downloadImageResults(sorter.name)}
                                            disabled={downloading}
                                            loading={downloading}
                                        >
                                            Download as Image
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <></>
                        )}

                        {compareId && result2 && sorter2 ? (
                            <Row gutter={24}>
                                <Col sm={12}>
                                    <SorterUserResults userInfo={result.user_info} date={result.created_date} />
                                    <SorterResults
                                        results={result.results}
                                        ties={result.ties}
                                        items={sorter.items}
                                        groups={sorter.groups}
                                        handleMouseOver={handleMouseOver}
                                        handleMouseOut={handleMouseOut}
                                        refs={elRefs}
                                    />
                                </Col>
                                <Col sm={12}>
                                    <SorterUserResults userInfo={result2.user_info} date={result2.created_date} />
                                    <SorterResults
                                        results={result2.results}
                                        ties={result2.ties}
                                        items={sorter2.items}
                                        groups={sorter2.groups}
                                        handleMouseOver={handleMouseOver}
                                        handleMouseOut={handleMouseOut}
                                        refs={elRefs2}
                                    />
                                </Col>
                            </Row>
                        ) : (
                            <>
                                <SorterUserResults userInfo={result.user_info} date={result.created_date} />
                                <SorterResults
                                    results={result.results}
                                    ties={result.ties}
                                    items={sorter.items}
                                    groups={sorter.groups}
                                    handleMouseOver={handleMouseOver}
                                    handleMouseOut={handleMouseOut}
                                    refs={elRefs}
                                />
                            </>
                        )}
                    </div>
                </LayoutBlockWrapper>
            ) : (
                <></>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    results: state.results.resultsList,
    sorters: state.sorters.sorterList,
    location: state.router.location,
    accessToken: state.auth.accessToken
});

const mapDispatchToProps = {
    getSorterResult,
    getSorter,
    getSorterVersion
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterResultsPage);
