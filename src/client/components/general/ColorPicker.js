import React, { useState, useEffect } from 'react';
import useComponentVisible from '../../hooks/useComponentVisible';

const defaultColor = '#7b689d';
const defaultOptions = ['#7b689d', '#f5a5a4'];
const pickerStyleDefault = {
    width: '40px',
    height: '30px',
    borderRadius: '2px',
    border: '1px solid rgb(67 67 67)',
    cursor: 'pointer'
};
const wrapperStyleDefault = {
    position: 'absolute',
    align: 'right',
    top: '100%',
    padding: '10px',
    zIndex: 99,
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3), 0px 4px 8px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgb(67 67 67)',
    borderRadius: '2px',
    color: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: '#1f1f1f'
};
const swatchStyleDefault = {
    width: '20px',
    height: '20px',
    margin: '0 5px 5px 0',
    borderRadius: '2px',
    cursor: 'pointer'
};
const inputStyleDefault = {
    border: '1px solid rgb(67 67 67)',
    borderRadius: '2px',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: '4px 11px'
};

const checkHex = (hex) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

const ColorPicker = ({
    initialColor,
    colors,
    onChange,
    pickerStyle = {},
    wrapperStyle = {},
    swatchStyle = {},
    inputStyle = {}
}) => {
    const [currentColor, setColor] = useState(initialColor ?? defaultColor);
    const [inputColor, setInputColor] = useState(currentColor);
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
    const options = colors ?? defaultOptions;

    const handleChange = (colorCode) => {
        setInputColor(colorCode);
        if (checkHex(colorCode)) setColor(colorCode);
    };

    const handleSwatchChange = (colorCode) => {
        setInputColor(colorCode);
        setColor(colorCode);
    };

    useEffect(() => {
        handleSwatchChange(initialColor);
    }, [initialColor]);

    useEffect(() => {
        if (onChange) onChange(currentColor);
    }, [currentColor]);

    return (
        <div className='color-picker-wrapper' ref={ref}>
            <div
                className='color-picker-current'
                style={{
                    ...pickerStyleDefault,
                    ...pickerStyle,
                    backgroundColor: currentColor
                }}
                tabIndex={0}
                onClick={() => setIsComponentVisible((prev) => !prev)}
                onKeyPress={(e) => e.key === 'Enter' && setIsComponentVisible((prev) => !prev)}
            ></div>
            {isComponentVisible && (
                <div className='color-picker-popover' style={{ ...wrapperStyleDefault, ...wrapperStyle }}>
                    <div
                        className='color-picker-swatch-wrapper'
                        style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', marginRight: '-5px' }}
                    >
                        {options.map((color, index) => (
                            <div
                                className={`color-picker-swatch${
                                    color === currentColor ? ' color-picker-swatch-selected' : ''
                                }`}
                                key={index}
                                style={{
                                    ...swatchStyleDefault,
                                    ...swatchStyle,
                                    backgroundColor: color,
                                    border: color === currentColor ? '1px solid #fff' : 'none'
                                }}
                                tabIndex={0}
                                onClick={() => handleSwatchChange(color)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSwatchChange(color)}
                            />
                        ))}
                    </div>
                    <div>
                        <input
                            className='color-picker-input'
                            type='text'
                            value={inputColor}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={() => setInputColor(currentColor)}
                            style={{ ...inputStyleDefault, ...inputStyle }}
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setIsComponentVisible((prev) => !prev)}
                        ></input>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
