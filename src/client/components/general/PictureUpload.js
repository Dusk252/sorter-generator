import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const PictureUpload = ({ checkers, onChange, value }) => {
    const [loading, setLoading] = useState(false);

    const beforeUpload = (file) => {
        checkers.forEach((checker) => {
            if (!checker.validator(file)) {
                message.error(checker.errorMessage);
                return false;
            }
        });
        return true;
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (imageUrl) => {
                onChange(imageUrl);
                setLoading(false);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Upload.Dragger
            name='picture'
            listType='picture-card'
            className='picture-uploader'
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {value ? <img src={value} alt='img' style={{ width: '100%' }} /> : uploadButton}
        </Upload.Dragger>
    );
};

export default PictureUpload;
