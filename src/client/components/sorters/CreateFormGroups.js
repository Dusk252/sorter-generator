import React, { useState } from 'react';
import { Form, Input, Button, Empty } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ColorPicker from './../general/ColorPicker';

const CreateFormGroups = ({ form, formName, colors, onValuesChange }) => {
    const [groupCount, setGroupCount] = useState(0);
    const [prevCount, setPrevCount] = useState(-1);
    const localOnValuesChange = (_, allValues) => {
        if (groupCount === prevCount) onValuesChange(form, allValues);
        setPrevCount(groupCount);
    };
    return (
        <Form form={form} name={formName} autoComplete='off' onValuesChange={localOnValuesChange}>
            <Form.List name='groups'>
                {(fields, { add, remove }) => {
                    return (
                        <>
                            {fields.length ? (
                                fields.map((field, index) => {
                                    const group = form.getFieldValue('groups')[index];
                                    return (
                                        <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                                            <Form.Item
                                                name={[field.name, 'name']}
                                                fieldKey={[field.fieldKey, 'name']}
                                                style={{ marginRight: '8px', flexBasis: '100%' }}
                                                rules={[{ required: true, message: 'The group needs a name.' }]}
                                            >
                                                <Input placeholder='Title' />
                                            </Form.Item>
                                            <Form.Item
                                                name={[field.name, 'color']}
                                                fieldKey={[field.fieldKey, 'color']}
                                                style={{ marginRight: '8px' }}
                                            >
                                                <ColorPicker
                                                    initialColor={
                                                        group != null && group.color != null
                                                            ? group.color
                                                            : colors.find(
                                                                  (item) =>
                                                                      !form
                                                                          .getFieldsValue('groups')
                                                                          .groups.some(
                                                                              (group) =>
                                                                                  group != null && group.color === item
                                                                          )
                                                              ) ?? colors[0]
                                                    }
                                                    colors={colors}
                                                    pickerStyle={{ width: '50px', height: '32px' }}
                                                    inputStyle={{ width: '145px' }}
                                                />
                                            </Form.Item>

                                            <Button
                                                type='dashed'
                                                onClick={() => {
                                                    setGroupCount((count) => count - 1);
                                                    remove(field.name);
                                                }}
                                                block
                                                style={{ marginLeft: '25px', flexShrink: '2' }}
                                            >
                                                <MinusOutlined /> Remove
                                            </Button>
                                        </div>
                                    );
                                })
                            ) : (
                                <Empty
                                    className='ant-empty-small'
                                    style={{ marginBottom: '15px' }}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description='No Groups'
                                />
                            )}

                            <Form.Item>
                                <Button
                                    type='dashed'
                                    className='add-group-button'
                                    onClick={() => {
                                        setGroupCount((count) => count + 1);
                                        add();
                                    }}
                                    block
                                >
                                    <PlusOutlined /> Add group
                                </Button>
                            </Form.Item>
                        </>
                    );
                }}
            </Form.List>
        </Form>
    );
};

export default CreateFormGroups;
