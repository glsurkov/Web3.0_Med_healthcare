import React from 'react';

const Button = ({title,type,classes,onClick}) => {
    return (
        <button onClick={onClick} type={type} className={classes}>{title}</button>
    );
};

export default Button;