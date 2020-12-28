import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Space, Divider, Col, Row } from 'antd';
import { pageTypes, getPage, getUpdatedItems, resetHasMoreCheck } from '../store/pagination/paginationActions';
import LayoutBlockWrapper from '../components/general/LayoutBlockWrapper';
import InfiniteLoader from '../components/general/InfiniteLoader';
import SorterHistoryItem from './../components/users/SorterHistoryItem';

const SorterResultsList = ({ results, resultsPage, getPage, getUpdatedItems, user }) => {
    return (
        <>
            <Helmet>
                <title>{`Sorter History${user && user.profile ? ` - ${user.profile.username}` : ''}`}</title>
            </Helmet>
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
                                    getUpdated={() =>
                                        getUpdatedItems(
                                            resultsPage.items.length,
                                            resultsPage.lastUpdated,
                                            pageTypes.sorter_results
                                        )
                                    }
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
        </>
    );
};

const mapStateToProps = (state) => ({
    resultsPage: state.pages.sorter_results,
    results: state.results.resultsList,
    user: state.auth.currentUser
});

const mapDispatchToProps = {
    getPage,
    getUpdatedItems,
    resetHasMoreCheck
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterResultsList);
