import React from 'react';
import {Link} from "react-router-dom";


//GDPR -- EURO DOC
//152 -- ФЕДЕРАЛЬНЫЙ ЗАКОН

const PatientMiniCard = ({patient}) => {
    return (
        <Link to={"/card/" + patient.address} state = {{from:"patients",account:patient.address, patient:{name:patient.name,surname:patient.surname,age:patient.age}}}
         className='patient-mini-card patient-mini-card--margin10p'>
                <div>
                    <ul>
                        <li>
                            {patient.name}
                        </li>
                        <li>
                            {patient.surname}
                        </li>
                        <li>
                            {patient.age}
                        </li>
                    </ul>
                </div>
        </Link>
    );
};

export default PatientMiniCard;