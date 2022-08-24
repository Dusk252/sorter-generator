import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Space, Divider, Col, Row } from 'antd';
import { pageTypes, getPage, resetHasMoreCheck } from '../store/pagination/paginationActions';
import LayoutBlockWrapper from '../components/general/LayoutBlockWrapper';
import InfiniteLoader from '../components/general/InfiniteLoader';
import SorterHistoryListing from '../components/sorterResults/SorterHistoryListing';

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
                                    getFirstPage={() =>
                                        getPage(
                                            0,
                                            resultsPage.lastUpdated,
                                            pageTypes.sorter_results
                                        )
                                    }
                                    resetHasMoreCheck={resetHasMoreCheck}
                                    render={(items, data) => <SorterHistoryListing items={items} results={data} />}
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
    resetHasMoreCheck
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterResultsList);
