import React, { useState, useEffect } from 'react';

const copyOverRemaining = (sourceList, destList, startI) => {
    const res = [...destList];
    for (let i = startI; i < sourceList.length; i++) {
        res.push(sourceList[i]);
    }
    return res;
};

const Sorter = ({ characters }) => {
    const arrLenght = characters.length;
    const nRounds = Math.ceil(Math.log2(arrLenght));

    const [curMatch, setCurMatch] = useState({ left: null, right: null });
    const [toggleClick, setToggleClick] = useState(true);

    const [ties, setTies] = useState(new Array(characters.length));
    const [handlingTie, setHandlingTie] = useState(false);
    const [progress, setProgress] = useState({
        roundLen: characters.length - 1,
        totalOps: nRounds * (characters.length - 1),
        elapsedOps: 0
    });

    const [calcState, setCalcState] = useState({
        currentRound: 1,
        currentRoundArr: characters.map((_, index) => [index]),
        nextRoundArr: [],
        currentLList: 0,
        currentRList: 1,
        curResList: [],
        leftP: 0,
        rightP: 0,
        extraRound: false,
        extraRoundList: null
    });

    const [prevState, setPrevState] = useState(null);
    const [isFinished, setFinished] = useState(false);

    const processStepUpdates = ({ leftStep, rightStep, tie = false }) => {
        const currentLList = calcState.extraRound
            ? calcState.extraRoundList
            : calcState.currentRoundArr[calcState.currentLList];
        const currentRList = calcState.currentRoundArr[calcState.currentRList];
        const addItem = leftStep > 0 ? currentLList[calcState.leftP] : currentRList[calcState.rightP];
        const pointerKey = leftStep > 0 ? 'leftP' : 'rightP';

        if (calcState.leftP + leftStep < currentLList.length && calcState.rightP + rightStep < currentRList.length) {
            setCalcState((prev) => ({
                ...prev,
                curResList: [...prev.curResList, addItem],
                [pointerKey]: prev[pointerKey] + 1
            }));
            setProgress((prev) => ({ ...prev, elapsedOps: prev.elapsedOps + 1 }));
        } else if (calcState.leftP + leftStep >= currentLList.length) {
            const resList = copyOverRemaining(currentRList, [...calcState.curResList, addItem], calcState.rightP);
            setProgress((prev) => ({ ...prev, elapsedOps: prev.elapsedOps + currentRList.length - calcState.rightP + 1 }));
            processRoundUpdates(resList);
        } else if (calcState.rightP + rightStep >= currentRList.length) {
            const resList = copyOverRemaining(
                currentLList,
                [...calcState.curResList, addItem],
                tie ? calcState.leftP + 1 : calcState.leftP
            );
            setProgress((prev) => ({ ...prev, elapsedOps: prev.elapsedOps + currentLList.length - calcState.leftP + 1 }));
            processRoundUpdates(resList);
        }
    };

    const processRoundUpdates = (resList) => {
        if (calcState.extraRound) {
            setCalcState((prev) => ({
                ...prev,
                curResList: [],
                currentRound: prev.currentRound + 1,
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
                    currentRound: prev.currentRound + 1,
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
                setCalcState((prev) => ({
                    ...prev,
                    curResList: [],
                    currentLList: -1,
                    currentRList: prev.currentLList + 2,
                    leftP: 0,
                    rightP: 0,
                    nextRoundArr: [...prev.nextRoundArr, resList],
                    extraRound: true,
                    extraRoundList: prev.nextRoundArr[0]
                }));
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
        if (calcState.currentRound === nRounds) setFinished(true);
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

    useEffect(() => {
        if (handlingTie) {
            processStepUpdates({ leftStep: 1, rightStep: 0, tie: true });
            setHandlingTie(false);
        }
    }, [handlingTie]);

    const handleLeftClick = () => {
        if (toggleClick) {
            setToggleClick(false);
            setPrevState({
                calcState: calcState,
                ties: ties
            });
            processStepUpdates({ leftStep: 1, rightStep: 0 });
        }
    };

    const handleRightClick = () => {
        if (toggleClick) {
            setToggleClick(false);
            setPrevState({
                calcState: calcState,
                ties: ties
            });
            processStepUpdates({ leftStep: 0, rightStep: 1 });
        }
    };

    const handleTie = () => {
        if (toggleClick) {
            setToggleClick(false);
            setPrevState({
                calcState: calcState,
                ties: ties
            });
            const leftChar = calcState.extraRound
                ? calcState.extraRoundList[calcState.leftP]
                : calcState.currentRoundArr[calcState.currentLList][calcState.leftP];
            const rightChar = calcState.currentRoundArr[calcState.currentRList][calcState.rightP];
            setTies((prev) => {
                let newState = { ...prev };
                if (newState[leftChar]) newState[leftChar].push(rightChar);
                else newState[leftChar] = [rightChar];
                return newState;
            });
            const newRightArr = [...calcState.currentRoundArr[calcState.currentRList]];
            newRightArr.splice(calcState.rightP, 1);
            setCalcState((prev) => ({
                ...prev,
                currentRoundArr: Object.assign([...prev.currentRoundArr], { [prev.currentRList]: newRightArr })
            }));
            setProgress((prev) => {
                const elapsedThisRound = prev.elapsedOps - (calcState.currentRound - 1) * prev.roundLen;
                return {
                    ...prev,
                    roundLen: prev.roundLen - 1,
                    totalOps:
                        (calcState.currentRound - 1) * prev.roundLen +
                        Math.max(prev.roundLen - 1, Math.round(elapsedThisRound + (prev.roundLen - 1) / 2)) +
                        (nRounds - calcState.currentRound) * (prev.roundLen - 1)
                };
            });
            setHandlingTie(true);
        }
    };

    const handleUndo = () => {
        if (toggleClick && prevState != null) {
            setTies(prevState.ties);
            setCalcState(prevState.calcState);
            setPrevState(null);
        }
    };

    let counter = 0;
    let tieCount = 0;

    return (
        <>
            <div>Progress: {Math.min(Math.round((progress.elapsedOps * 100) / progress.totalOps), 100)}%</div>
            {isFinished ? (
                <div>
                    {calcState.currentRoundArr[0].map((char) => {
                        counter = counter + 1;
                        if (ties[char]) tieCount = tieCount + ties[char].length;
                        else {
                            counter = counter + tieCount;
                            tieCount = 0;
                        }
                        return (
                            <>
                                <div key={char}>{`${counter}. ${characters[char].name}`}</div>
                                {ties[char] &&
                                    ties[char].map((tieChar) => (
                                        <div key={tieChar}>{`${counter}. ${characters[tieChar].name}`}</div>
                                    ))}
                            </>
                        );
                    })}
                </div>
            ) : (
                curMatch.left != null &&
                curMatch.right != null && (
                    <>
                        <div onClick={handleLeftClick}>
                            <img src={curMatch.left.picture} />
                        </div>
                        <div onClick={handleTie}>TIE</div>
                        <div onClick={handleUndo}>UNDO</div>
                        <div onClick={handleRightClick}>
                            <img src={curMatch.right.picture} />
                        </div>
                    </>
                )
            )}
        </>
    );
};

export default Sorter;
