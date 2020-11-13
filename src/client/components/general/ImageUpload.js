import React, { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

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

const ImageUpload = ({ checkers, onChange, value }) => {
    const [loading, setLoading] = useState(false);
    const [base64Value, setBase64Value] = useState('');

    useEffect(() => {
        if (value) {
            const processValue = async () => {
                const base64 = await getBase64(value);
                setBase64Value(base64);
                setLoading(false);
            };
            processValue();
        } else setBase64Value('');
    }, [value]);

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
            onChange(info.file.originFileObj);
            return;
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
            {base64Value ? <img src={base64Value} alt='img' style={{ width: '100%' }} /> : uploadButton}
        </Upload.Dragger>
    );
};

export default ImageUpload;
