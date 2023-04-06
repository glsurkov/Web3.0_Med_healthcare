import React, {useState, useContext} from 'react';
import {AuthContext} from "../context";
import {useLocation} from "react-router-dom";
import Header from "../UI/Header";
import Avatar from "../UI/Avatar";
import image from '../images/AvatarImg.svg'
import ModalWindow from "../UI/ModalWindow";
import IllnessCard from "../components/IllnessCard";
import Button from "../UI/Button";
import AddForm from "../components/AddForm";
import Sign from "../metamask/Sign.js";

const PersonCard = (props) => {

    const {currentAccount,provider} = useContext(AuthContext)

    const [illnesses,setIllnesses] = useState(
        [{
            title:"name of illness",
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates.",
        },
        {
            title:"name of illness",
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates."
        },
        {
            title:"name of illness",
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates."
        },
        {
            title:"name of illness",
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates."
        },{
            title:"name of illness",
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, voluptates."
        }])

    const location = useLocation()

    if(location.state){
        props = location.state
    }

    const [modal, setModal] = useState(false)
    const [addForm,setAddForm] = useState(false)

    const activateModal = (e) => {
        setModal(true)
        e.stopPropagation()
    }

    const activeAddForm = (e) =>{
        if(!addForm){
            setAddForm(true)
        }else{
            setAddForm(false)
        }
        e.stopPropagation()
    }

    const SignInformation = (e) =>{
        e.preventDefault()
        Sign(currentAccount, provider, props.account)
    }

    return (
        <div onClick={() => {
            setAddForm(false)
        }}>
            <Header/>
            <ModalWindow state = {modal} setState={setModal}>
                <Button classes={"custom-button custom-button--green"} onClick={activeAddForm} title={"Add"}/>
                <AddForm illnesses={illnesses} setIllnesses = {setIllnesses} state = {addForm}/>
                {illnesses.map((el,i)=>{
                    return (
                        <IllnessCard key={i} illness={el}/>
                    )
                })}
            </ModalWindow>
            <main className="menu">
                {/*<div>*/}
                {/*    <Link className="back" to="/"> Back </Link>*/}
                {/*</div>*/}
                <div className='patient-info'>
                    <div className='patient-info__field'>
                        <p>Your account — <span className='patient-info__field patient-info__field--color'>{props.account}</span></p>
                    </div>
                    <div className='patient-info__field'>
                        <Avatar image = {image}/>
                    </div>
                    <div className='patient-info__field'>
                        Name — <span className='patient-info__field patient-info__field--color'>{props.patient.name}</span>
                    </div>
                    <div className='patient-info__field'>
                        Surname — <span className='patient-info__field patient-info__field--color'>{props.patient.surname}</span>
                    </div>
                    <div className='patient-info__field'>
                        Age — <span className='patient-info__field patient-info__field--color'>{props.patient.age}</span>
                    </div>
                    <div onClick={activateModal} className="patient-info__field">
                       <span className='patient-info__field--click'>Med history</span>
                    </div>
                    <Button title="Sign" classes={"custom-button custom-button--white"} onClick={SignInformation}/>
                </div>
            </main>
        </div>
    );
};

export default PersonCard;