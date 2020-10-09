import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import PictureUpload from '../general/PictureUpload';
import TagGroup from '../general/TagGroup';

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

const CreateFormBase = ({ form, formName }) => {
    const onPictureChange = (picture) => form.setFieldsValue([picture]);
    return (
        <Form form={form} name={formName} autoComplete='off' className='base-form'>
            <div className='base-form-wrapper'>
                <Form.Item
                    className='base-form-picture-field'
                    name='picture'
                    rules={[
                        {
                            required: true,
                            message: 'Please upload a logo or other representative picture.'
                        }
                    ]}
                >
                    <PictureUpload
                        checkers={pictureChekcers}
                        onChange={onPictureChange}
                        value={form.getFieldValue('picture')}
                    />
                </Form.Item>
                <div className='base-form-right'>
                    <Form.Item
                        name='title'
                        rules={[
                            {
                                required: true,
                                message: 'The sorter needs a title.'
                            }
                        ]}
                    >
                        <Input placeholder='Title' autoComplete='off' />
                    </Form.Item>
                    <Form.Item name='tags'>
                        <TagGroup
                            initialTags={form.getFieldValue('tags')}
                            onChange={(tags) => form.setFieldsValue({ tags: tags })}
                        />
                    </Form.Item>
                    <Form.Item name='isPrivate' valuePropName='checked' className='checkbox-input'>
                        <Checkbox>Private Sorter</Checkbox>
                    </Form.Item>
                </div>
            </div>
            <Form.Item name='description'>
                <Input.TextArea placeholder='Description' autoComplete='off' rows='4' />
            </Form.Item>
        </Form>
    );
};

export default CreateFormBase;
