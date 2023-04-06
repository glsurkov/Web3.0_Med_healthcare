import React from 'react';

const LoginButton = ({onConnect}) => {

    return <button className='authentification__button' onClick={onConnect}><b>Log In</b></button>;

};

export default LoginButton;