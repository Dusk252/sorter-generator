import React, { useState, useEffect } from 'react';
import SorterInteractions from './SorterInteractions';
import SorterProgress from './SorterProgress';
import SorterResults from './SorterResults';
import { Space } from 'antd';

const copyOverRemaining = (sourceList, destList, startI) => {
    const res = [...destList];
    for (let i = startI; i < sourceList.length; i++) {
        res.push(sourceList[i]);
    }
    return res;
};

const Sorter = ({ sorterName, sorterLogo, characters, groups, calcState, setCalcState }) => {
    const [curMatch, setCurMatch] = useState({ left: null, right: null });
    const [toggleClick, setToggleClick] = useState(true);

    const [prevState, setPrevState] = useState(null);
    const [isFinished, setFinished] = useState(calcState.currentRoundArr.length === 1);

    const processStepUpdates = ({ leftStep, rightStep, tie = false }) => {
        setPrevState(calcState);

        const currentLList = calcState.extraRound
            ? calcState.extraRoundList
            : calcState.currentRoundArr[calcState.currentLList];
        const currentRList = calcState.currentRoundArr[calcState.currentRList];

        const leftChar = calcState.extraRound
            ? calcState.extraRoundList[calcState.leftP]
            : calcState.currentRoundArr[calcState.currentLList][calcState.leftP];
        const rightChar = calcState.currentRoundArr[calcState.currentRList][calcState.rightP];
        const leftTieCount = calcState.ties[leftChar] ?? 0;
        const rightTieCount = calcState.ties[rightChar] ?? 0;

        if (tie) {
            setCalcState((prev) => ({
                ...prev,
                ties: { ...prev.ties, [leftChar]: leftTieCount + rightTieCount + 1 }
            }));
        }

        leftStep = leftStep === 0 ? 0 : leftStep + leftTieCount;
        rightStep = rightStep === 0 ? 0 : rightStep + rightTieCount;

        const addItems = currentLList
            .slice(calcState.leftP, calcState.leftP + leftStep)
            .concat(currentRList.slice(calcState.rightP, calcState.rightP + rightStep));

        if (calcState.leftP + leftStep < currentLList.length && calcState.rightP + rightStep < currentRList.length) {
            setCalcState((prev) => ({
                ...prev,
                curResList: [...prev.curResList, ...addItems],
                leftP: prev.leftP + leftStep,
                rightP: prev.rightP + rightStep
            }));
            setCalcState((prev) => ({ ...prev, progress: prev.progress + leftStep + rightStep }));
        } else if (calcState.leftP + leftStep >= currentLList.length) {
            const resList = copyOverRemaining(
                currentRList,
                [...calcState.curResList, ...addItems],
                calcState.rightP + rightStep
            );
            setCalcState((prev) => ({
                ...prev,
                progress: prev.progress + currentRList.length - calcState.rightP + leftStep
            }));
            processRoundUpdates(resList);
        } else if (calcState.rightP + rightStep >= currentRList.length) {
            const resList = copyOverRemaining(
                currentLList,
                [...calcState.curResList, ...addItems],
                calcState.leftP + leftStep
            );
            setCalcState((prev) => ({
                ...prev,
                progress: prev.progress + currentLList.length - calcState.leftP + rightStep
            }));
            processRoundUpdates(resList);
        }
    };

    const processRoundUpdates = (resList) => {
        if (calcState.extraRound) {
            setCalcState((prev) => ({
                ...prev,
                curResList: [],
                currentRoundArr: Object.assign([...prev.nextRoundArr], { 0: resList }),
                currentLList: 0,
                currentRList: 1,
                leftP: 0,
                rightP: 0,
                nextRoundArr: [],
                extraRound: false,
                extraRoundList: null
            }));
        } else if (calcState.currentRList + 2 >= calcState.currentRoundArr.length) {
            if (!(calcState.currentLList + 2 < calcState.currentRoundArr.length)) {
                setCalcState((prev) => ({
                    ...prev,
                    curResList: [],
                    currentRoundArr: [...prev.nextRoundArr, resList],
                    currentLList: 0,
                    currentRList: 1,
                    leftP: 0,
                    rightP: 0,
                    nextRoundArr: [],
                    extraRound: false,
                    extraRoundList: null
                }));
            } else {
                setCalcState((prev) => {
                    const nextRoundArr = [...prev.nextRoundArr, resList];
                    return {
                        ...prev,
                        curResList: [],
                        currentLList: -1,
                        currentRList: prev.currentLList + 2,
                        leftP: 0,
                        rightP: 0,
                        nextRoundArr: nextRoundArr,
                        extraRound: true,
                        extraRoundList: nextRoundArr[0]
                    };
                });
            }
        } else {
            setCalcState((prev) => ({
                ...prev,
                curResList: [],
                currentLList: prev.currentLList + 2,
                currentRList: prev.currentRList + 2,
                leftP: 0,
                rightP: 0,
                nextRoundArr: [...prev.nextRoundArr, resList]
            }));
        }
    };

    useEffect(() => {
        if (calcState.currentRoundArr.length === 1) setFinished(true);
        else {
            const leftChar = calcState.extraRound
                ? characters[calcState.extraRoundList[calcState.leftP]]
                : characters[calcState.currentRoundArr[calcState.currentLList][calcState.leftP]];
            const rightChar = characters[calcState.currentRoundArr[calcState.currentRList][calcState.rightP]];

            if (leftChar && rightChar) {
                setCurMatch({
                    left: leftChar,
                    right: rightChar
                });
                setToggleClick(true);
            }
        }
    }, [calcState]);

    const handleLeftClick = () => {
        if (toggleClick) {
            setToggleClick(false);
            processStepUpdates({ leftStep: 1, rightStep: 0 });
        }
    };

    const handleRightClick = () => {
        if (toggleClick) {
            setToggleClick(false);
            processStepUpdates({ leftStep: 0, rightStep: 1 });
        }
    };

    const handleTie = () => {
        if (toggleClick) {
            setToggleClick(false);
            processStepUpdates({ leftStep: 1, rightStep: 1, tie: true });
        }
    };

    const handleUndo = () => {
        if (toggleClick && prevState != null) {
            setCalcState(prevState);
            setPrevState(null);
        }
    };

    return (
        <>
            {isFinished ? (
                <SorterResults
                    results={calcState.currentRoundArr[0]}
                    ties={calcState.ties}
                    characters={characters}
                    groups={groups}
                    sorterName={sorterName}
                    sorterLogo={sorterLogo}
                />
            ) : (
                <Space size='large' direction='vertical' style={{ width: '100%' }}>
                    <SorterProgress progress={calcState.progress} total={calcState.totalOps} />
                    {curMatch.left != null && curMatch.right != null && (
                        <SorterInteractions
                            charLeft={{ ...curMatch.left, group: groups[curMatch.left.group] }}
                            charRight={{ ...curMatch.right, group: groups[curMatch.right.group] }}
                            handleLeftClick={handleLeftClick}
                            handleRightClick={handleRightClick}
                            handleTie={handleTie}
                            handleUndo={handleUndo}
                            isUndoEnabled={prevState !== null}
                        />
                    )}
                </Space>
            )}
        </>
    );
};

export default Sorter;
