import React from 'react';
import Image from './../general/ImageWithFallback';
import { Row, Col, Button, Typography } from 'antd';

const CharacterButton = ({ character, onClick }) => {
    return (
        <Button type='text' htmlType='button' className='sorter-item' onClick={onClick}>
            {character.picture ? (
                <div className='sorter-list-item-img'>
                    <Image className='sorter-item-img' src={character.picture} />
                </div>
            ) : (
                <></>
            )}
            <div className='sorter-item-text'>
                <div className='chara-form-text chara-form-text-name'>
                    <Typography.Title level={5} style={{ display: 'inline' }}>
                        {' '}
                        {character.name}
                    </Typography.Title>
                </div>
                {character.group != null && (
                    <div className='chara-form-text chara-form-text-group'>
                        <i>{character.group.name}</i>
                    </div>
                )}
            </div>
        </Button>
    );
};

const SorterInteractions = ({
    charLeft,
    charRight,
    handleLeftClick,
    handleRightClick,
    handleTie,
    handleUndo,
    isUndoEnabled
}) => {
    return (
        <Row justify='center'>
            <Col sm={8} md={7} lg={6} xl={5}>
                <CharacterButton character={charLeft} onClick={handleLeftClick} />
            </Col>
            <Col sm={8} md={7} lg={6} xl={5} className='sorter-item-buttons'>
                <Button type='primary' htmlType='button' onClick={handleTie}>
                    TIE
                </Button>
                <Button type='primary' htmlType='button' onClick={handleUndo} disabled={!isUndoEnabled}>
                    UNDO
                </Button>
            </Col>
            <Col sm={8} md={7} lg={6} xl={5}>
                <CharacterButton character={charRight} onClick={handleRightClick} />
            </Col>
        </Row>
    );
};

export default SorterInteractions;
