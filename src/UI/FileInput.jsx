import React, {useState} from 'react';

const FileInput = ({label,onChange,name,setName,forWho}) => {


    return (
        <>
            <label className="file-input" htmlFor={forWho}>{label}</label>
            <input onChange={(e) => {
                onChange(e);
                setName(e.target.files[0].name)
            }} id={forWho} type="file" multiple = "multiple" name = "files[]"/>
            <div>{name ? name : "NONE"}</div>
        </>
    );
};

export default FileInput;