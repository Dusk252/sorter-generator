import React from 'react';
import { connect } from 'react-redux';
import { Space, Divider, Col, Row } from 'antd';
import { pageTypes, getPage, resetHasMoreCheck, getNewItems } from '../store/pagination/paginationActions';
import { ArrowUpOutlined } from '@ant-design/icons';
import LayoutBlockWrapper from '../components/general/LayoutBlockWrapper';
import InfiniteLoader from '../components/general/InfiniteLoader';
import SorterHistoryItem from './../components/users/SorterHistoryItem';

const ToTopComponent = () => {
    return (
        <>
            New Results
            <ArrowUpOutlined style={{ marginLeft: '5px' }} />
        </>
    );
};

const SorterResultsList = ({ results, resultsPage, getPage, getNewItems, user }) => {
    return (
        <LayoutBlockWrapper>
            <Space size='large' direction='vertical' style={{ width: '100%' }}>
                {user && (
                    <>
                        <Divider orientation='center'>{user.profile.username}'s Sorter History</Divider>
                        <div className='sorter-results-list'>
                            <InfiniteLoader
                                data={results}
                                page={resultsPage}
                                pageName='results'
                                getPage={() =>
                                    getPage(resultsPage.items.length, resultsPage.lastUpdated, pageTypes.sorter_results)
                                }
                                getNewItems={() => getNewItems(resultsPage.lastUpdated, pageTypes.sorter_results)}
                                resetHasMoreCheck={resetHasMoreCheck}
                                render={(items, data) => (
                                    <Row className='sorter-history' gutter={'10'}>
                                        {items.map((id) => (
                                            <Col span={24} lg={12} key={id}>
                                                <SorterHistoryItem data={data[id]} />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                                ToTopComponent={ToTopComponent}
                            ></InfiniteLoader>
                        </div>
                    </>
                )}
            </Space>
        </LayoutBlockWrapper>
    );
};

const mapStateToProps = (state) => ({
    resultsPage: state.pages.sorter_results,
    results: state.results.resultsList,
    user: state.auth.currentUser
});

const mapDispatchToProps = {
    getPage,
    resetHasMoreCheck,
    getNewItems
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterResultsList);
