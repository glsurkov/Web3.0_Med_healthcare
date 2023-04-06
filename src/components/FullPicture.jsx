import React from 'react';

const FullPicture = ({image}) => {
    return (
        <div className="full-picture-container">
            <img className="full-picture" src = {image} alt="pic"/>
        </div>
    );
};

export default FullPicture;