import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSorter } from '../store/sorters/sortersActions';
import { Button, Space, Divider } from 'antd';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import Sorter from './../components/sorters/Sorter';
import SorterGroupSelect from './../components/sorters/SorterGroupSelect';
import SorterHeader from './../components/sorters/SorterHeader';
import SorterCharacterListing from './../components/sorters/SorterCharacterListing';
import useSorterCounter from './../hooks/useSorterCounter';

const LOCAL_STORAGE_STRING = 'SORTER_PROGRESS_';

const SorterPage = ({ sorters, getSorter, match }) => {
    const sorterId = match.params.id;
    const [sorterGroups, setSorterGroups] = useState();
    const [sorter, setSorter] = useState();
    const [isSorting, setIsSorting] = useState(false);
    const [prevProgress, setPrevProgress] = useState();
    const history = useHistory();
    useSorterCounter(sorterId, 'VIEW');
    useEffect(() => {
        setPrevProgress(JSON.parse(localStorage.getItem(LOCAL_STORAGE_STRING + sorterId)));
    }, []);
    useEffect(() => {
        if (isSorting) history.push(history.location.href);
        const unlisten = history.listen((_, action) => {
            if (action === 'POP' && isSorting) {
                setIsSorting(false);
            }
        });
        return unlisten;
    }, [isSorting]);
    useEffect(() => {
        if (sorters[sorterId] && sorters[sorterId].extended_info) {
            setSorter(sorters[sorterId]);
        } else getSorter(sorterId);
    }, [sorters]);
    useEffect(() => {
        if (sorter) {
            setSorterGroups(sorter.extended_info.groups.map((_, index) => index));
        }
    }, [sorter]);
    const handleCheckGroup = (groupIndex, isAdd) => {
        setSorterGroups((prev) => {
            let newSelectGroups;
            if (isAdd) {
                newSelectGroups = [...prev];
                newSelectGroups.push(groupIndex);
            } else newSelectGroups = prev.filter((item) => item != groupIndex);
            return newSelectGroups;
        });
    };
    const toggleSelectAll = (check) => {
        setSorterGroups(check ? sorter.extended_info.groups.map((_, index) => index) : []);
    };
    return (
        sorter != null &&
        sorterGroups != null && (
            <LayoutBlockWrapper>
                {isSorting ? (
                    <Sorter
                        localStorageKey={LOCAL_STORAGE_STRING + sorterId}
                        characters={
                            sorter.extended_info.groups && sorter.extended_info.groups.length
                                ? sorter.extended_info.characters.filter((char) => sorterGroups.includes(char.group))
                                : sorter.extended_info.characters
                        }
                        groups={sorter.extended_info.groups}
                        sorterName={sorter.base_info.name}
                        sorterLogo={sorter.base_info.picture}
                        initialState={prevProgress}
                    />
                ) : (
                    <Space size='large' direction='vertical' style={{ width: '100%' }}>
                        <SorterHeader
                            sorterName={sorter.base_info.name}
                            sorterLogo={sorter.base_info.picture}
                            className='sorter-header'
                        />
                        {prevProgress != null && (
                            <div>
                                You have progress saved for this sorter. Current progress:{' '}
                                {Math.round((prevProgress.progress * 100) / prevProgress.totalOps)}%
                            </div>
                        )}
                        <Button
                            type='primary'
                            htmlType='button'
                            onClick={() => {
                                localStorage.removeItem(LOCAL_STORAGE_STRING + sorterId);
                                setPrevProgress(null);
                                setIsSorting(true);
                            }}
                            className='sorter-start-button'
                            block
                        >
                            {prevProgress ? 'Restart' : 'Start'}
                        </Button>
                        {prevProgress != null && (
                            <Button
                                type='primary'
                                htmlType='button'
                                onClick={() => setIsSorting(true)}
                                className='sorter-start-button'
                                block
                            >
                                Continue
                            </Button>
                        )}
                        {sorter.extended_info.groups != null && sorter.extended_info.groups.length !== 0 && (
                            <SorterGroupSelect
                                groups={sorter.extended_info.groups}
                                selectedGroups={sorterGroups}
                                handleCheckGroup={handleCheckGroup}
                                toggleSelectAll={toggleSelectAll}
                                className='sorter-group-select'
                            />
                        )}
                        <Divider orientation='left'>Sorter Info</Divider>
                        <SorterCharacterListing
                            groups={sorter.extended_info.groups}
                            characters={sorter.extended_info.characters}
                        />
                    </Space>
                )}
            </LayoutBlockWrapper>
        )
    );
};

const mapStateToProps = (state) => ({
    sorters: state.sorters.sorterList
});

const mapDispatchToProps = {
    getSorter
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterPage);
