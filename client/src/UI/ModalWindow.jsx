import React, {useEffect, useState} from 'react';

const ModalWindow = ({state,children,setState}) => {

    const defaultClass = ["modal-window"]
    const [classes,setClasses] = useState(defaultClass)

    useEffect(() => {if(state) {
            setClasses([...classes, "modal-window--active"])
        }
        else if(classes.includes("modal-window--active")){
            setClasses(defaultClass)
        }
    },[state])

    return (
        <div onClick = {() => setState(false)} className = {classes.join(' ')}>
            <div onClick={(event)=>{
                event.stopPropagation()
            }} className="modal-window__content">
                {children}
            </div>
        </div>
    );
};

export default ModalWindow;