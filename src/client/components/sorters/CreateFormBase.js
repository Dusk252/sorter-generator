import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import ImageUpload from '../general/ImageUpload';
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

const CreateFormBase = ({ form, formName, onValuesChange }) => {
    const onPictureChange = (picture) => form.setFieldsValue([picture]);
    const localOnValuesChange = (_, allValues) => {
        onValuesChange(form, allValues);
    };
    return (
        <Form form={form} name={formName} autoComplete='off' className='base-form' onValuesChange={localOnValuesChange}>
            <div className='base-form-wrapper'>
                <Form.Item className='base-form-picture-field' name='picture'>
                    <ImageUpload
                        checkers={pictureChekcers}
                        onChange={onPictureChange}
                        value={form.getFieldValue('picture')}
                    />
                </Form.Item>
                <div className='base-form-right'>
                    <Form.Item name='name'>
                        <Input placeholder='Name' autoComplete='off' />
                    </Form.Item>
                    <Form.Item name='tags'>
                        <TagGroup
                            initialTags={form.getFieldValue('tags')}
                            onChange={(tags) => form.setFieldsValue({ tags: tags })}
                        />
                    </Form.Item>
                    <Form.Item name='isPrivate' valuePropName='checked' className='checkbox-input'>
                        <Checkbox defaultChecked={false}>Private Sorter</Checkbox>
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
