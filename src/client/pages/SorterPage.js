import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSorter, incrementViewCount } from '../store/sorters/sortersActions';
import { Button, Space, Divider, Row, Typography } from 'antd';
import LayoutBlockWrapper from './../components/general/LayoutBlockWrapper';
import Sorter from './../components/sorters/Sorter';
import SorterGroupSelect from './../components/sorters/SorterGroupSelect';
import SorterHeader from './../components/sorters/SorterHeader';
import SorterCharacterListing from './../components/sorters/SorterCharacterListing';

const LOCAL_STORAGE_STRING = 'SORTER_PROGRESS_';

const SorterPage = ({ sorters, getSorter, incrementViewCount, match }) => {
    const sorterId = match.params.id;
    const [sorter, setSorter] = useState();
    const [sorterGroups, setSorterGroups] = useState();
    const [selectedCharacters, setSelectedCharacters] = useState();
    const [isSorting, setIsSorting] = useState(false);
    const [calcState, setCalcState] = useState();
    const history = useHistory();
    useEffect(() => {
        console.log('increment view');
        incrementViewCount(sorterId);
    }, []);
    useEffect(() => {
        if (calcState && calcState.progress > 0)
            localStorage.setItem(LOCAL_STORAGE_STRING + sorterId, JSON.stringify({ calcState, selectedCharacters }));
    }, [calcState]);
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
            const initialState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STRING + sorterId));
            if (initialState) {
                setCalcState(initialState.calcState);
                setSelectedCharacters(initialState.selectedCharacters);
            }

            setSorterGroups(sorter.extended_info.groups.map((_, index) => index));
        }
    }, [sorter]);

    const getTotalOps = (chunks) => {
        let counter = 0;
        let firstSlotSize = 1;
        let roundChunkSize = 1;
        while (chunks > 1) {
            let hasExtra = chunks % 2 === 1;
            if (hasExtra) {
                counter = counter + firstSlotSize + (chunks - 2) * roundChunkSize + firstSlotSize + roundChunkSize * 2;
                firstSlotSize = firstSlotSize + roundChunkSize * 2;
            } else {
                counter = counter + firstSlotSize + (chunks - 1) * roundChunkSize;
                firstSlotSize = firstSlotSize + roundChunkSize;
            }
            roundChunkSize = roundChunkSize * 2;
            chunks = Math.floor(chunks / 2);
        }
        return counter;
    };

    const handleRestart = () => {
        localStorage.removeItem(LOCAL_STORAGE_STRING + sorterId);
        const characters =
            sorter.extended_info.groups && sorter.extended_info.groups.length
                ? sorter.extended_info.characters.filter((char) => sorterGroups.includes(char.group))
                : sorter.extended_info.characters;
        setSelectedCharacters(characters);
        setCalcState({
            currentRoundArr: characters.map((_, index) => [index]),
            nextRoundArr: [],
            currentLList: 0,
            currentRList: 1,
            curResList: [],
            leftP: 0,
            rightP: 0,
            extraRound: false,
            extraRoundList: null,
            ties: {},
            progress: 0,
            totalOps: getTotalOps(characters.length)
        });
        setIsSorting(true);
    };

    const handleContinue = () => {
        setIsSorting(true);
    };

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
                {isSorting && calcState != null && selectedCharacters != null ? (
                    <Sorter
                        characters={selectedCharacters}
                        groups={sorter.extended_info.groups}
                        sorterName={sorter.base_info.name}
                        sorterLogo={sorter.base_info.picture}
                        calcState={calcState}
                        setCalcState={setCalcState}
                    />
                ) : (
                    <Space size='large' direction='vertical' style={{ width: '100%' }}>
                        <SorterHeader
                            sorterName={sorter.base_info.name}
                            sorterLogo={sorter.base_info.picture}
                            className='sorter-header'
                        />
                        {calcState && calcState.progress > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <Typography.Paragraph>
                                    You have progress saved for this sorter. Current progress:{' '}
                                    {Math.round((calcState.progress * 100) / calcState.totalOps)}%
                                </Typography.Paragraph>
                                {sorter.extended_info.groups != null && sorter.extended_info.groups.length > 0 && (
                                    <Typography.Paragraph type='warning'>
                                        If you decide to continue with your previous progress your group selection in this
                                        page will be ignored.
                                    </Typography.Paragraph>
                                )}
                            </div>
                        )}
                        <Row justify='center'>
                            <Button
                                type='primary'
                                htmlType='button'
                                onClick={handleRestart}
                                className='sorter-start-button'
                                block
                            >
                                {calcState && calcState.progress > 0 ? 'Restart' : 'Start'}
                            </Button>
                            {calcState && calcState.progress > 0 && (
                                <Button
                                    type='primary'
                                    htmlType='button'
                                    onClick={handleContinue}
                                    className='sorter-start-button'
                                    block
                                >
                                    Continue
                                </Button>
                            )}
                        </Row>
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
    getSorter,
    incrementViewCount
};

export default connect(mapStateToProps, mapDispatchToProps)(SorterPage);
