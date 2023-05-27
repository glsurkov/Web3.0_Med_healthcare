import React, {useContext, useEffect, useState, useRef} from 'react';
import FileInput from "../UI/FileInput";
import Input from "../UI/Input";
import Button from "../UI/Button";
import ModalWindow from "../UI/ModalWindow";
import FullPicture from "./FullPicture";
import {AuthContext} from "../context";
import axios from "axios";
import {create as ipfsHttpClient} from "ipfs-http-client";
import authorization from "../keys";
import {imageDecrypt, imageEncrypt, handleImageUpload} from "../encryption/encrypt.mjs"

const IllnessCard = ({illness, card , account, setHash, illnesses, setIllnesses, currentJSON, setCard}) => {

    const [active, setActive] = useState(false)
    const [name, setName] = useState(false)
    const [input1, setInput1] = useState(illness.diagnosis)
    const [input2, setInput2] = useState(illness.description)
    const [modal, setModal] = useState(false)
    const [picture, setPicture] = useState(null)
    const {currentAccount, userRole, contract, secret} = useContext(AuthContext)
    const [pictures, setPictures] = useState([])
    const onSubmit = useRef()

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001",
        headers: {
            authorization,
        },
    });

    const captureFile = (e) => {
        e.preventDefault()
        console.log('captured')
    }

    const activateModal = (e) => {
        setPicture(e.target.src)
        setModal(true)
        e.stopPropagation()
    }

    const removePic = async (hash) => {
        // await removeUser(hash)

        illness.images = illness.images.filter(el => el !== hash)
        setPictures(pictures.filter(el => el.hash !== hash))
    }

    // const removeUser = async (hash) =>{
    //     console.log('Удаляем')
    //     const res = await axios.post(`https://ipfs.infura.io:5001/api/v0/pin/rm?arg=${hash}`,{},{
    //         headers:{
    //             Authorization: authorization,
    //         }
    //     })
    //     console.log(res)
    // }

    const activeEditForm = (e) => {
        if(!active){
            setActive(true)
        }else{
            setActive(false)
        }
    }

    useEffect(() => {
        onSubmit.current = async (e) => {
            e.preventDefault()
            const form = e.target;
            const files = form[2].files;
            let results = [];
            let encrypted = []

            if (!files || files.length === 0) {
                let res = window.confirm("Do you want to attach some files?");
                if(res){
                    return alert('Attach some files')
                }
            }

            for(let i = 0; i < files.length; i++){
                [encrypted, results] = imageEncrypt(files[i], encrypted)
            }
            console.log(results)

            const newIllness = {
                diagnosis: form[0].value,
                description: form[1].value,
                images: [...illness.images, ...results],
                imageSecret: secret,
                IlnessId: illness.IlnessId
            }

            // console.log(currentJSON)

            // const newCardJSON = {
            //     userAddress: account,
            //     illnesses:[
            //         ...currentJSON.illnesses.filter(el => el.IlnessId !== illness.IlnessId),
            //         newIllness
            //     ].sort((el1,el2) => {
            //         if(el1.IlnessId > el2.IlnessId){
            //             return 1
            //         }else if (el1.IlnessId < el2.IlnessId){
            //             return  -1
            //         }
            //         return 0
            //     })
            // }
            //
            // console.log(newCardJSON)
            //
            // const result = await ipfs.add(JSON.stringify(newCardJSON));
            //
            // try{
            //     await removeUser(card)
            // }catch (err){
            //     console.log(err)
            // }
            //
            // setHash(result.path)
            // const cardix = await contract.methods.updateCard(account).send({from:currentAccount})
            // const user = await contract.methods.getSpecificUser(account).call();
            // const file = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + result.path)
            // setCard(file.data)
            // console.log(file)

            const newCardJSON = {
                userAddress: account,
                illnesses:[
                    ...currentJSON.illnesses.filter(el => el.IlnessId !== illness.IlnessId),
                    newIllness
                ].sort((el1,el2) => {
                    if(el1.IlnessId > el2.IlnessId){
                        return 1
                    }else if (el1.IlnessId < el2.IlnessId){
                        return  -1
                    }
                    return 0
                })
            }
            setCard(newCardJSON)
            setIllnesses([...illnesses, newIllness])

            setActive(false)
            e.target.reset()
            setName('Файл не выбран')
            console.log('submitted...')
        }
    }, [secret])


    useEffect(()=>{

        console.log(secret)

        const onLoad = async () => {
            const picturesArray = [];
            console.log(illness.images.length)
            if (illness.images.length > 0) {
                for (let i = 0; i < illness.images.length; i++) {
                    const pictureEncrypted = await axios.get("https://skywalker.infura-ipfs.io/ipfs/" + illness.images[i])
                    console.log(pictureEncrypted)
                    console.log(illness.imagesSecret)
                    const pictureDecrypted = await imageDecrypt(pictureEncrypted.data, illness.imageSecret)
                    picturesArray.push({picture: pictureDecrypted, hash: illness.images[i]})
                }
            }
            setPictures([...picturesArray])
        }

        onLoad()
    },[])



    return (
        <div className="illness-card">
            {(currentAccount === process.env.REACT_APP_OWNER_ACCOUNT || userRole === 'DOCTOR')
             ?<Button onClick={activeEditForm} classes="custom-button custom-button--white custom-button--position-absolute" title="Edit"/>
             : null}
            {active
                ?
                <form onSubmit={onSubmit.current}>
                    <Input  value = {input1} onChange = {(e) => {
                        setInput1(e.target.value)
                    }} classes="input-text input-text--margin-bottom"/>
                    <textarea value={input2} onChange = {(e) => {
                        setInput2(e.target.value)
                    }} className="input-text input-description input-text--margin-bottom"/>
                    <FileInput forWho = {"edit-med-history-file"} name = {name} setName={setName} onChange={captureFile} label = {"Attach file"}/>
                    {pictures.length > 0 ?
                        <div className="pictures-container">
                            {pictures.map((el,index) => {
                                return (
                                    <div key = {el.hash} className="illness-card__image-container">
                                        <div onClick={() => {removePic(el.hash)}} className="cancel"></div>
                                        <img onClick={activateModal} className="illness-card__image" src = {el.picture} alt="image"/>
                                    </div>)
                            })}
                        </div>
                        : null}
                    <Button classes="custom-button custom-button--white custom-button--margin-top" type="submit" title="Submit"/>
                </form>
                :
                <>
                    <p><b>Diagnosis -  </b>{illness.diagnosis}</p>
                    <b>Description: </b>
                    <p>{illness.description}</p>
                    <b>Attached files:</b>
                    {pictures.length > 0 ?
                        <div className="pictures-container">
                            {pictures.map((el,index) => {
                                return (
                                    <div key = {el.hash} className="illness-card__image-container">
                                        <img onClick={activateModal} className="illness-card__image" src = {el.picture} alt="image"/>
                                    </div>)
                            })}
                        </div>
                            : null}
                </>}
            <ModalWindow state={modal} setState={setModal}>
                <FullPicture image={picture}/>
            </ModalWindow>
        </div>
    );
};

export default IllnessCard;