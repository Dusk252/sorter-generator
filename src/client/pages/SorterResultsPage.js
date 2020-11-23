import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getSorterResult } from '../store/sorterResults/sorterResultsActions';
import { getSorter, getSorterVersion } from '../store/sorters/sortersActions';
import SorterResults from './../components/sorters/SorterResults';
import SorterHeader from './../components/sorters/SorterHeader';
import { Button, Row, Col, Input, Tooltip } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import * as htmlToImage from 'html-to-image';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';

const SorterResultsPage = ({ results, sorters, getSorterResult, getSorter, getSorterVersion, match, location }) => {
    const resultId = match.params.id;
    const [sorter, setSorter] = useState();
    const [result, setResult] = useState();
    const [urlCopied, setUrlCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    useEffect(() => {
        if (results[resultId] && results[resultId].results) {
            setResult(results[resultId]);
        } else getSorterResult(resultId);
    }, [results]);
    useEffect(() => {
        if (result) {
            if (!sorters[result.sorter_id]) getSorter(result.sorter_id, true, result.version_id);
            else {
                const version = sorters[result.sorter_id].info.find((el) => el.version_id === result.sorter_version_id);
                if (version && version.items && version.groups) setSorter(version);
                else getSorterVersion(result.sorter_id, result.sorter_version_id);
            }
        }
    }, [result, sorters]);

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

    return result && sorter ? (
        <LayoutBlockWrapper>
            <div className='sorter-results-page'>
                <SorterHeader sorterName={sorter.name} sorterLogo={sorter.picture} className='sorter-header' />
                {location.query && location.query.share ? (
                    <>
                        <Row className='control-buttons' justify='center'>
                            <Col sm={16} md={14} lg={12} xl={10} style={{ textAlign: 'center' }}>
                                <div className='share-results'>
                                    <p>Share your results:</p>
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

                <SorterResults results={result.results} ties={result.ties} items={sorter.items} groups={sorter.groups} />
            </div>
        </LayoutBlockWrapper>
    ) : (
        <></>
    );
};

const mapStateToProps = (state) => ({
    results: state.results.resultsList,
    sorters: state.sorters.sorterList,
    location: state.router.location
});

const mapDispatchToProps = {
    getSorterResult,
    getSorter,
    getSorterVersion
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterResultsPage);
