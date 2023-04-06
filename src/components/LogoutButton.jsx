import React from 'react';

const LogoutButton = ({onDisconnect}) => {
    return (
        <button className='authentification__button' onClick={onDisconnect}>
            <b>Log Out</b>
        </button>
    );
};

export default LogoutButton;