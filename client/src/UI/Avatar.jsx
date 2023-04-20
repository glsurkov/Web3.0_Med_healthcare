import React from 'react';

const Avatar = ({image}) => {
    return (
        <div className='avatar-container'>
            <img className='avatar' src={image} alt = 'Аватарка'/>
        </div>
    );
};

export default Avatar;