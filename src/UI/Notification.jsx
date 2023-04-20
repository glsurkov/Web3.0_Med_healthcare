import React, {useEffect} from 'react';

const Notification = ({clicked, setClicked}) => {

    const toast = document.getElementById("toast");

    useEffect(() => {
        if(clicked){
            toast.classList.add("active");
            setTimeout(()=> {
                toast.classList.remove("active");
                }, 5000)
        }
        setClicked(false)
    },[clicked])

    return (
            <div className="toast" id="toast">
                <i className="fas fa-exclamation-circle"></i>
                <p className="toast-text">YOU ARE NOT IN SYSTEM</p>
                <i className="fas fa-close" id="close"></i>
            </div>
    );
};

export default Notification;