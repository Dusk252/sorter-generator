import React from 'react';
import Image from './../general/ImageWithFallback';
import { Row, Col, Button, Typography } from 'antd';

const ItemButton = ({ item, onClick }) => {
    return (
        <Button type='text' htmlType='button' className='sorter-item' onClick={onClick}>
            {item.picture ? (
                <div className='sorter-item-img'>
                    <Image className='sorter-item-img' src={item.picture} />
                </div>
            ) : (
                <></>
            )}
            <div className='sorter-item-text'>
                <div className='chara-form-text chara-form-text-name'>
                    <Typography.Title level={5} style={{ display: 'inline' }}>
                        {' '}
                        {item.name}
                    </Typography.Title>
                </div>
                {item.group != null && (
                    <div className='chara-form-text chara-form-text-group'>
                        <i>{item.group.name}</i>
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
                <ItemButton item={charLeft} onClick={handleLeftClick} />
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
                <ItemButton item={charRight} onClick={handleRightClick} />
            </Col>
        </Row>
    );
};

export default SorterInteractions;
