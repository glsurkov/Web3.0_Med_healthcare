import React, {useContext, useEffect, useState} from 'react';
import FileInput from "../UI/FileInput";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { create as ipfsHttpClient } from "ipfs-http-client";
import authorization from "../keys";
import {AuthContext} from "../context";
import axios from "axios";


const AddForm = ({card,state,setIllnesses,illnesses,currentJSON,setCard,account,setHash}) => {

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001",
        headers: {
            authorization,
        },
    });

    const {contract, currentAccount} = useContext(AuthContext);


    const defaultClass = ["add-form"]
    const [classes,setClasses] = useState(defaultClass)
    const [name,setName] = useState("Файл не выбран")

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

    const removeUser = async (hash) =>{
        console.log('Удаляем')
            const res = await axios.post(`https://ipfs.infura.io:5001/api/v0/pin/rm?arg=${hash}`,{},{
                headers:{
                    Authorization: authorization,
                }
            })
        console.log(res)
    }

    const onSubmit = async (e) => {

        e.preventDefault()
        const form = e.target;
        const files = form[2].files;
        const results = [];

        if (!files || files.length === 0) {
            return alert("No files selected");
        }

        for(let i = 0; i < files.length; i++){
            const result = await ipfs.add(files[i]);
            results.push(result.path)
        }
        console.log(results)

        const newIllness = {
            diagnosis: form[0].value,
            description: form[1].value,
            images: results,
            IlnessId: Date.now()
        }

        console.log(currentJSON)
        const newCardJSON = {
            userAddress: account,
            illnesses:[
                ...currentJSON.illnesses,
                newIllness
            ]
        }

        const result = await ipfs.add(JSON.stringify(newCardJSON));

        try{
            await removeUser(card)
        }catch (err){
            console.log(err)
        }

        setHash(result.path)
        const cardix = await contract.methods.updateCard(account, result.path).send({from:currentAccount})
        const user = await contract.methods.getSpecificUser(account).call();
        const file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + result.path)
        setCard(file.data)
        console.log(file)
        setIllnesses([...illnesses, newIllness])

        e.target.reset()
        setName('Файл не выбран')
        console.log('submitted...')
    }

    return (
        <form id = "1" onSubmit={onSubmit} className={classes.join(' ')}>
            <Input classes="input-text input-text--greenBack" placeholder = "Diagnosis"/>
            <textarea className="input-text input-description input-text--greenBack" placeholder="Description"/>
            <FileInput forWho={"med-history-file"} setName = {setName} name = {name} onChange = {captureFile} label = {"Attach file"}/>
            <Button classes = "custom-button custom-button--white" title={"Submit"} type={"submit"}/>
        </form>
    );
};

export default AddForm;