import React, {useEffect, useRef, useState} from 'react';
import FileInput from "../UI/FileInput";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { create as ipfsHttpClient } from "ipfs-http-client";
import authorization from "../keys";


const AddForm = ({state,setIllnesses,illnesses}) => {

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001",
        headers: {
            authorization,
        },
    });

    const defaultClass = ["add-form"]
    const [classes,setClasses] = useState(defaultClass)
    const [name,setName] = useState("Файл не выбран")
    const [ipfsHash, setIpfsHash] = useState("")

    useEffect(() => {if(state) {
        setClasses([...classes, "add-form--active"])
    }
    else if(classes.includes("add-form--active")){
        setClasses(defaultClass)
    }
    },[state])


    const captureFile = (e) => {
        e.preventDefault()
        console.log('captured')
    }

    const onSubmit = async (e) => {

        e.preventDefault()
        const form = e.target;
        const files = form[2].files;

        if (!files || files.length === 0) {
            return alert("No files selected");
        }

        const file = files[0];
        const result = await ipfs.add(file);
        console.log(result)
        setIpfsHash(result)
        setIllnesses([...illnesses,{title:form[0].value,description:form[1].value,images:result.path}])

        e.target.reset()
        setName('Файл не выбран')
        console.log('submitted...')
    }

    return (
        <form id = "1" onSubmit={onSubmit} className={classes.join(' ')}>
            <Input classes="input-text input-text--greenBack" placeholder = "Diagnosis"/>
            <textarea className="input-text input-description input-text--greenBack" placeholder="Description"/>
            <FileInput setName = {setName} name = {name} onChange = {captureFile} label = {"Attach file"}/>
            <Button classes = "custom-button custom-button--white" title={"Submit"} type={"submit"}/>
        </form>
    );
};

export default AddForm;