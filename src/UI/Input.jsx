import React from 'react';

const Input = ({placeholder,classes,value, onChange}) => {
    return (
        <input className={classes} onChange={onChange} type="text" placeholder = {placeholder} value={value} />
    );
};

export default Input;