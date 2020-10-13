import React, { useState, useEffect } from 'react';
import { Input, Tag, Tooltip } from 'antd';

const TagGroup = ({ initialTags = null, onChange }) => {
    const [tags, setTags] = useState(initialTags);
    const [inputState, setInputState] = useState('');

    const handleInputChange = (e) => {
        setInputState(e.target.value);
    };

    const handleInputConfirm = (e) => {
        const value = e.target.value;
        if (value) {
            if (!tags || tags.indexOf(value) === -1) {
                const newTags = tags ? [...tags, value] : [value];
                setTags(newTags);
            }
        }
        setInputState('');
    };

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };

    useEffect(() => {
        if (tags) onChange(tags);
    }, [tags]);

    return (
        <>
            <Input
                type='text'
                size='small'
                className='tag-input'
                value={inputState}
                onBlur={(e) => handleInputConfirm(e)}
                onPressEnter={(e) => handleInputConfirm(e)}
                onChange={(e) => handleInputChange(e)}
                placeholder='Insert new tag...'
                style={{ marginBottom: '5px' }}
            />
            {tags ? (
                tags.map((tag) => {
                    const isLongTag = tag.length > 20;

                    const tagElem = (
                        <Tag className='tag' key={tag} closable={true} onClose={() => handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })
            ) : (
                <i style={{ color: 'rgba(255, 255, 255, 0.3)' }}>No tags</i>
            )}
        </>
    );
};

export default TagGroup;
