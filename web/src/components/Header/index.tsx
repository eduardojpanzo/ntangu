import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CadastreForm, SignInForm } from '../FormElement';
import { Container } from './styles';

export function Header() {
  const {user,logout} = useAuth()

  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  function handleLogOut() {
    logout()
  }

  const today = Date.now();

  const dateFormat = new Intl.DateTimeFormat('pt-PT', {month: 'long',day: '2-digit'}).format(today);
  const HourFormat = new Intl.DateTimeFormat('pt-PT', {hour: '2-digit', minute: '2-digit'}).format(today);

  return (
    <Container>
      <h1>Streamline</h1>
      
      <div className='rightSide'>
        {!user?
          (<div className='acessButton'>
            <button className={"signIn"} onClick={()=>setOpenSignIn(true)}>
              Logar
            </button>

            <button className={"signUp"} onClick={()=>setOpenSignUp(true)}>
              Cadastro
            </button>
          </div>):(
            <button className={"signUp"} onClick={handleLogOut}>
              Logout
            </button>
          )
        }

        <div className='timeDate'>
          <p>{HourFormat}</p>
          <span>{dateFormat}</span>
        </div>
      </div>
      <SignInForm open={openSignIn} setOpen={setOpenSignIn}/>
      <CadastreForm open={openSignUp} setOpen={setOpenSignUp}/>
    </Container>
  )
}