import React from 'react';

const LoginButton = ({onConnect, onClick}) => {

    return <button className='authentification__button' onClick={() => {onConnect(); onClick()}}><b>Log In</b></button>;

};

export default LoginButton;