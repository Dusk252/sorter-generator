import React from 'react';
import { Row, Col, Checkbox, Divider } from 'antd';

const SorterGroupSelect = ({
    groups,
    selectedGroups,
    handleCheckGroup,
    toggleSelectAll,
    toggleSelectUngrouped,
    className
}) => {
    const handleSelectAll = (e) => {
        toggleSelectAll(e.target.checked);
    };

    const handleSelectUngrouped = (e) => {
        toggleSelectUngrouped(e.target.checked);
    };

    const onChange = (e, index) => {
        handleCheckGroup(index, e.target.checked);
    };

    return (
        <>
            <Divider orientation='left'>Group Selection</Divider>
            <Row className={className} justify='center'>
                <Col sm={24} md={21} lg={18} xl={15}>
                    <Row justify='start'>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Checkbox defaultChecked={true} onChange={(e) => handleSelectAll(e)}>
                                Select All
                            </Checkbox>
                        </Col>
                        <Divider />
                        {groups.map((group, index) => (
                            <Col span={8} key={index}>
                                <Checkbox checked={selectedGroups.includes(index)} onChange={(e) => onChange(e, index)}>
                                    {group.name}
                                </Checkbox>
                            </Col>
                        ))}
                        {toggleSelectUngrouped != null ? (
                            <Col span={8}>
                                <Checkbox defaultChecked={true} onChange={(e) => handleSelectUngrouped(e)}>
                                    Ungrouped
                                </Checkbox>
                            </Col>
                        ) : (
                            <></>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default SorterGroupSelect;
