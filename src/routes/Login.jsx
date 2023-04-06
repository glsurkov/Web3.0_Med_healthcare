import LoginButton from "../components/LoginButton";
import Header from "../UI/Header";

function Login({onConnect,isConnected}) {

  return (
    <div className="App">
        <Header/>
      <section className='authentification'>
        <div className='authentification__wrapper'>
            {!isConnected ? <LoginButton onConnect = {onConnect}/> : null}
        </div>
      </section>
      <footer className="footer">

      </footer>
    </div>
  );
}

export default Login;
