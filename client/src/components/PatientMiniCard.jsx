import React,{useState} from 'react';
import {Link} from "react-router-dom";


//GDPR -- EURO DOC
//152 -- ФЕДЕРАЛЬНЫЙ ЗАКОН

const PatientMiniCard = ({patient, account, list}) => {

    const [miniCard,setMiniCard] = useState(patient.userCard.jsonHash)
    console.log(patient.userCard.jsonHash)

    return (
        <Link to={"/card/" + account} state = {{
            from:list,
            account:account,
            patient:{
                name:patient.userName,
                surname:patient.userSurname,
                age:patient.userAge,
                role:patient.userRole,
                card:miniCard,
            }}}
         className='patient-mini-card patient-mini-card--margin10p'>
                <div className='patient-mini-card__content-container'>
                    <ul className='patient-mini-card__content'>
                        <li className='patient-mini-card__text'>
                            Name — {patient.userName}
                        </li>
                        <li className='patient-mini-card__text'>
                            Surname — {patient.userSurname}
                        </li>
                        <li className='patient-mini-card__text'>
                            Age — {patient.userAge}
                        </li>
                    </ul>
                </div>
        </Link>
    );
};

export default PatientMiniCard;