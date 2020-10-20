import React, { useState, useEffect } from 'react';

const getRoundEstimates = (n) => {
    const nRounds = Math.ceil(Math.log2(n));
    let chunkSize = 1;
    let roundSize = Math.floor(n / (2 * chunkSize));
    let roundEstimates = [];
    for (let i = 0; i < nRounds; i++) {
        roundEstimates[i].push(roundSize * (2 * chunkSize - 1));
        chunkSize = chunkSize * 2;
        roundSize = Math.floor(n / (2 * chunkSize));
    }
    console.log(roundEstimates);
    return roundEstimates;
};

const Sorter = ({ characters }) => {
    const arrLenght = characters.length;

    const [ties, setTies] = useState({});
    const [progress, setProgress] = useState({
        totalCharacters: characters.length,
        totalMoves: characters.length * Math.log2(characters.length),
        elapsedMoves: 0
    });
    const [curMatch, setCurMatch] = useState({ left: null, right: null });

    const [calcArrays, setCalcArrays] = useState({
        sorted: characters,
        buffer: new Array(characters.length)
    });
    const [calcState, setCalcState] = useState({
        size: 1,
        leftStart: 0,
        left: 0,
        right: 1,
        leftLimit: 1,
        rightLimit: 2,
        counter: 0
    });

    const [isFinished, setFinished] = useState(false);

    useEffect(() => {
        if (calcState.left < calcState.leftLimit && calcState.right < calcState.rightLimit) {
            if (ties[calcArrays.sorted[calcState.left].name]) copyLeft();
            else if (ties[calcArrays.sorted[calcState.right].name]) copyRight();
            else setCurMatch({ left: calcArrays.sorted[calcState.left], right: calcArrays.sorted[calcState.right] });
        } else if (calcState.left < calcState.leftLimit) {
            copyLeft();
        } else if (calcState.right < calcState.rightLimit) {
            copyRight();
        } else {
            setCalcState((prev) => {
                const newLeftStart = prev.leftStart + 2 * prev.size;
                if (newLeftStart < arrLenght) return { ...prev, leftStart: newLeftStart };
                else {
                    setCalcArrays((prev) => ({
                        buffer: prev.sorted,
                        sorted: prev.buffer
                    }));

                    const newSize = prev.size * 2;
                    if (newSize < arrLenght) {
                        return { ...prev, size: newSize, leftStart: 0 };
                    } else {
                        setFinished(true);
                        return prev;
                    }
                }
            });
        }
    }, [calcState.left, calcState.right]);

    useEffect(() => {
        setCalcState((prev) => {
            const right = Math.min(prev.leftStart + prev.size, arrLenght);
            return {
                ...prev,
                left: prev.leftStart,
                right: right,
                leftLimit: right,
                rightLimit: Math.min(right + prev.size, arrLenght),
                counter: prev.leftStart
            };
        });
    }, [calcState.leftStart]);

    const copyLeft = () => {
        setCalcArrays((prev) => ({
            ...prev,
            buffer: Object.assign([...prev.buffer], { [calcState.counter]: prev.sorted[calcState.left] })
        }));
        setCalcState((prev) => ({ ...prev, left: prev.left + 1, counter: prev.counter + 1 }));
    };

    const copyRight = () => {
        setCalcArrays((prev) => ({
            ...prev,
            buffer: Object.assign([...prev.buffer], { [calcState.counter]: prev.sorted[calcState.right] })
        }));
        setCalcState((prev) => ({ ...prev, right: prev.right + 1, counter: prev.counter + 1 }));
    };

    const handleLeftClick = () => {
        setProgress((prev) => ({ ...prev, elapsedMoves: prev.elapsedMoves + 1 }));
        copyLeft();
    };

    const handleRightClick = () => {
        setProgress((prev) => ({ ...prev, elapsedMoves: prev.elapsedMoves + 1 }));
        copyRight();
    };

    const handleTie = () => {
        setProgress((prev) => ({
            ...prev,
            totalCharacters: prev.totalCharacters - 1,
            totalMoves: prev.totalCharacters - 1 * Math.log2(prev.totalCharacters - 1)
        }));
        setTies((prev) => {
            let newState = { ...prev };
            newState[curMatch.right.name] = true;
            return newState;
        });
        copyLeft();
    };

    let counter = 0;
    let tieCount = 0;

    return (
        <>
            <div>Progress: {Math.round((progress.elapsedMoves * 100) / progress.totalMoves)}%</div>
            {isFinished ? (
                <div>
                    {calcArrays.sorted.map((char, index) => {
                        if (ties[char.name]) tieCount++;
                        else {
                            counter = counter + tieCount + 1;
                            tieCount = 0;
                        }
                        return <div key={index}>{`${counter}. ${char.name}`}</div>;
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
