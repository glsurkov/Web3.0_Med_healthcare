import LoginButton from "../components/LoginButton";
import Notification from "../UI/Notification";
import {useState, useContext} from "react";
import {AuthContext} from "../context";

function Login({onConnect,isConnected}) {

    const {defaultUser} = useContext(AuthContext)
    const [clicked, setClicked] = useState(false)

    const clickHandler = () => {
        setClicked(true)
    }

  return (
    <div className="App">
        <Notification clicked = {clicked} defaultUser = {defaultUser} setClicked={setClicked}/>
      <section className='authentification'>
        <div className='authentification__wrapper'>
            {!isConnected ? <LoginButton  onClick={clickHandler} onConnect = {onConnect}/> : null}
        </div>
      </section>
      <footer className="footer">

      </footer>
    </div>
  );
}

export default Login;
