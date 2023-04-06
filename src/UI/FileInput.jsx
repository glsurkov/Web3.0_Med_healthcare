import React, {useState} from 'react';

const FileInput = ({label,onChange,name,setName}) => {


    return (
        <>
            <label className="file-input" htmlFor="med-history-file">{label}</label>
            <input onChange={(e) => {
                onChange(e);
                setName(e.target.files[0].name)
            }} id="med-history-file" type="file"/>
            <span>{name}</span>
        </>
    );
};

export default FileInput;