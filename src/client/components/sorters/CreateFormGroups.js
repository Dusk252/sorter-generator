import React from 'react';
import { Form, Input, Button, Empty } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ColorPicker from './../general/ColorPicker';

const CreateFormGroups = ({ form, formName, colors }) => {
    return (
        <Form form={form} name={formName} autoComplete='off'>
            <Form.List name='groups'>
                {(fields, { add, remove }) => {
                    return (
                        <>
                            {fields.length ? (
                                fields.map((field, index) => (
                                    <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                                        <Form.Item
                                            name={[field.name, 'name']}
                                            fieldKey={[field.fieldKey, 'name']}
                                            rules={[{ required: true, message: 'The group needs a name.' }]}
                                            style={{ marginRight: '8px', flexBasis: '100%' }}
                                        >
                                            <Input placeholder='Title' />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'color']}
                                            fieldKey={[field.fieldKey, 'color']}
                                            rules={[{ required: true }]}
                                            style={{ marginRight: '8px' }}
                                        >
                                            <ColorPicker
                                                initialColor={
                                                    form.getFieldValue('groups')[index] != null
                                                        ? form.getFieldValue('groups')[index].color
                                                        : colors.find(
                                                              (item) =>
                                                                  !form
                                                                      .getFieldsValue('groups')
                                                                      .groups.some(
                                                                          (group) => group != null && group.color === item
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
                                                remove(field.name);
                                            }}
                                            block
                                            style={{ marginLeft: '25px', flexShrink: '2' }}
                                        >
                                            <MinusOutlined /> Remove
                                        </Button>
                                    </div>
                                ))
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
