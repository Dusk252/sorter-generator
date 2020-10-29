import React from 'react';
import Image from './../general/ImageWithFallback';
import { Row, Col, Button, Typography } from 'antd';

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
                <Button type='text' htmlType='button' className='sorter-item' onClick={handleLeftClick}>
                    <Image className='sorter-item-img' src={charLeft.picture} />
                    <div className='sorter-item-text'>
                        <div className='chara-form-text chara-form-text-name'>
                            <Typography.Title level={5} style={{ display: 'inline' }}>
                                {' '}
                                {charLeft.name}
                            </Typography.Title>
                        </div>
                        {charLeft.group != null && (
                            <div className='chara-form-text chara-form-text-group'>
                                <i>{charLeft.group.name}</i>
                            </div>
                        )}
                    </div>
                </Button>
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
                <Button type='text' htmlType='button' className='sorter-item' onClick={handleRightClick}>
                    <Image className='sorter-item-img' src={charRight.picture} />
                    <div className='sorter-item-text'>
                        <div className='chara-form-text chara-form-text-name'>
                            <Typography.Title level={5} style={{ display: 'inline' }}>
                                {' '}
                                {charRight.name}
                            </Typography.Title>
                        </div>
                        {charRight.group != null && (
                            <div className='chara-form-text chara-form-text-group'>
                                <i>{charRight.group.name}</i>
                            </div>
                        )}
                    </div>
                </Button>
            </Col>
        </Row>
    );
};

export default SorterInteractions;
