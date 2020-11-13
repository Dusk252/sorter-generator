import React, { useState } from 'react';
import { Form, Input, Button, Empty, Radio, Select, Typography, Row, Col } from 'antd';
import { MinusSquareOutlined, PlusOutlined } from '@ant-design/icons';
import ImageUpload from '../general/ImageUpload';

const pictureChekcers = [
    {
        validator: (file) => file.type === 'image/jpeg' || file.type === 'image/png',
        errorMessage: 'Please upload a jpg or png image.'
    },
    {
        validator: (file) => file.size / 1024 / 1024 < 1,
        errorMessage: 'The image must be smaller than 1MB.'
    }
];

const getBase64 = (img) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(img);
    });
};

const defaultGroupInfo = {
    name: null,
    color: 'rgba(255,255,255,0.5)'
};

const CreateFormItems = ({ form, formName, groups, editForm, editFormState, setEditFormState, onValuesChange }) => {
    const [formType, setFormType] = useState(0);
    const onPictureChange = (picture) => editForm.setFieldsValue([picture]);
    const onRemoveItem = (e, index) => {
        e.stopPropagation();
        const items = form.getFieldValue('items');
        form.setFieldsValue({ items: items.filter((_, i) => i != index) });
    };
    const onEditItem = (index) => {
        const items = form.getFieldValue('items');
        editForm.setFieldsValue({
            name: items[index].name,
            group: items[index].group,
            picture: items[index].picture
        });
        setEditFormState({ index: index, visible: true });
    };
    const onFormTypeChange = (e) => {
        setFormType(e.target.value);
        editForm.setFieldsValue({ picture: '' });
    };

    return (
        <>
            <Radio.Group onChange={onFormTypeChange} value={formType} className='item-form-type'>
                <Radio value={0}>URL</Radio>
                <Radio value={1}>Image Upload</Radio>
            </Radio.Group>
            <Form.Provider
                onFormFinish={async (name, { values, forms }) => {
                    if (name === 'charaForm') {
                        const { charaForm, step3 } = forms;
                        const items = step3.getFieldValue('items') || [];
                        if (values.picture && typeof values.picture !== 'string')
                            values.displayPicture = await getBase64(values.picture);
                        else values.displayPicture = values.picture ?? '';
                        if (editFormState.index != null)
                            step3.setFieldsValue({
                                items: Object.assign([], [...items], { [editFormState.index]: values })
                            });
                        else
                            step3.setFieldsValue({
                                items: [...items, values]
                            });
                        onValuesChange(step3);
                        setEditFormState({ index: null, visible: true });
                        charaForm.resetFields();
                    }
                }}
            >
                {editFormState.visible ? (
                    <Form form={editForm} name='charaForm' autoComplete='off' className='item-form'>
                        <div className='item-form-wrapper'>
                            {formType === 1 ? (
                                <Form.Item className='item-form-picture-field' name='picture'>
                                    <ImageUpload
                                        checkers={pictureChekcers}
                                        onChange={onPictureChange}
                                        value={editForm.getFieldValue('picture')}
                                    />
                                </Form.Item>
                            ) : (
                                <></>
                            )}
                            <div className='item-form-right'>
                                <Form.Item
                                    name='name'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please type in the item's name."
                                        }
                                    ]}
                                >
                                    <Input placeholder='Name' autoComplete='off' />
                                </Form.Item>
                                {formType === 0 ? (
                                    <Form.Item name='picture'>
                                        <Input placeholder='Image url' autoComplete='off' />
                                    </Form.Item>
                                ) : (
                                    <></>
                                )}
                                <Form.Item name='group'>
                                    <Select style={{ width: '100%' }} showArrow placeholder='Select group'>
                                        {groups != null &&
                                            groups.map((group, index) => {
                                                return (
                                                    <Select.Option key={index} value={index} label={group.name}>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span>{group.name}</span>
                                                            <span
                                                                style={{
                                                                    backgroundColor: group.color,
                                                                    borderRadius: '2px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                                                    display: 'inline-block',
                                                                    marginLeft: '5px',
                                                                    width: '40px',
                                                                    height: '15px'
                                                                }}
                                                            ></span>
                                                        </div>
                                                    </Select.Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <Button type='primary' htmlType='submit' block>
                            {editFormState.index == null ? 'Add' : 'Edit'}
                        </Button>
                    </Form>
                ) : (
                    <Button
                        type='dashed'
                        className='add-item-button'
                        onClick={() => {
                            setEditFormState({ visible: true });
                        }}
                        block
                    >
                        <PlusOutlined /> Add item
                    </Button>
                )}
                <Form form={form} name={formName} autoComplete='off' className='chara-form'>
                    <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.items !== curValues.items}>
                        {({ getFieldValue }) => {
                            const items = getFieldValue('items') || [];
                            return items.length ? (
                                <Row gutter={[16, 16]}>
                                    {items.map((chara, index) => {
                                        const group = groups && groups[chara.group] ? groups[chara.group] : defaultGroupInfo;
                                        return (
                                            <Col xs={24} md={12} xxl={8} key={index}>
                                                <div
                                                    className='chara-form-item'
                                                    style={{ borderColor: group.color }}
                                                    onClick={() => onEditItem(index)}
                                                >
                                                    {chara.displayPicture ? (
                                                        <img
                                                            src={chara.displayPicture}
                                                            alt={chara.name}
                                                            width='50'
                                                            height='50'
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <div className='chara-form-info'>
                                                        <div className='chara-form-text'>
                                                            <Typography.Title level={5} style={{ display: 'inline' }}>
                                                                {' '}
                                                                {chara.name}
                                                            </Typography.Title>
                                                        </div>
                                                        <div className='chara-form-text'>
                                                            <i>{group.name ?? 'no group'}</i>
                                                        </div>
                                                    </div>
                                                    <MinusSquareOutlined
                                                        className='chara-form-item-remove'
                                                        onClick={(e) => onRemoveItem(e, index)}
                                                    />
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Items' />
                            );
                        }}
                    </Form.Item>
                    <Form.Item
                        name='items'
                        className='chara-form-error'
                        rules={[{ required: true, message: "You can't create a sorter without items!" }]}
                    >
                        <Input type='hidden'></Input>
                    </Form.Item>
                </Form>
            </Form.Provider>
        </>
    );
};

export default CreateFormItems;
