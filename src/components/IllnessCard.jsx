import React, {useEffect, useState} from 'react';
import FileInput from "../UI/FileInput";
import Input from "../UI/Input";
import Button from "../UI/Button";
import ModalWindow from "../UI/ModalWindow";
import FullPicture from "./FullPicture";

const IllnessCard = ({illness}) => {

    const [active, setActive] = useState(false)
    const [state, setState] = useState(illness)
    const [input1, setInput1] = useState(illness.title)
    const [input2, setInput2] = useState(illness.description)
    const [modal, setModal] = useState(false)

    const activateModal = (e) => {
        setModal(true)
        e.stopPropagation()
    }

    const activeEditForm = (e) => {
        if(!active){
            setActive(true)
        }else{
            setActive(false)
        }
    }

    const picture = "https://skywalker.infura-ipfs.io/ipfs/" + state.images


    return (
        <div className="illness-card">
            <Button onClick={activeEditForm} classes="custom-button custom-button--white custom-button--position-absolute" title="Edit"/>
            {active
                ?
                <form>
                    <Input  value = {input1} onChange = {(e) => {
                        setInput1(e.target.value)
                    }} classes="input-text input-text--margin-bottom"/>
                    <textarea value={input2} onChange = {(e) => {
                        setInput2(e.target.value)
                    }} className="input-text input-description input-text--margin-bottom"/>
                    <FileInput label = {"Attach file"}/>
                    <Button classes="custom-button custom-button--white custom-button--margin-top" type="submit" title="Submit"/>
                </form>
                :
                <>
                    <p>{state.title}</p>
                    <p>{state.description}</p>
                    {state.images ?
                        <div className="illness-card__image-container">
                            <img onClick={activateModal} className="illness-card__image" src = {picture} alt="image"/>
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