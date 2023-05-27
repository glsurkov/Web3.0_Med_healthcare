import React, {useContext} from 'react';
import logo from "../images/medicine.png";
import {Link} from "react-router-dom";
import {AuthContext} from "../context";

const Header = () => {

    const {currentAccount,userRole} = useContext(AuthContext)

    return (
        <header className='header'>
            <div className='header__container'>
                <div className='logo'>
                    <img className="logo__image" src={logo}/>
                </div>
                <nav className='nav-bar'>
                    <Link className = 'link' to={"/card/" + currentAccount}><b>My Card</b></Link>
                    {userRole === "DOCTOR" || userRole === "ORGANIZATION" ? <Link className = 'link' to="/patients"><b>Patients</b></Link> : null}
                    <Link className = 'link' to="/doctors/"><b>Doctors</b></Link>
                    <Link className = 'link' to="/organizations/"><b>Organizations</b></Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;