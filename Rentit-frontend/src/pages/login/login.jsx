import './login.css';
import logo from '../../images/Logo.svg';
import { FcGoogle } from 'react-icons/fc';
import { GoMarkGithub } from 'react-icons/go';
import { SiFacebook } from 'react-icons/si';
import { Link } from 'react-router-dom';
import Steam from '../../components/Steam/Steam';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useNavigate } from 'react-router-dom';
import UserDetails from '../userDetails/userDetails';
import { useGlobalContext } from '../../Context';

const Login = () => {
  const { setLoginObj } = useGlobalContext(); //To store user's detials after Login
  const navigate = useNavigate();

  //If the user is Logged in then return the user detail page
  if (sessionStorage.getItem('userDetails')) {
    const data = JSON.parse(sessionStorage.getItem('userDetails'));
    return <UserDetails {...data} />;
  }
  //If the user is not logged in then return the Login page
  return (
    <div className='login-pg-wrap'>
      <div className='loginBox'>
        <div className='signInTop signIn'>
          <div className='logoBox'>
            <Link to='/'>
              <img className='signInLogo ' src={logo} alt='logo' />
            </Link>
          </div>
          <div className='line lineLogin'></div>
        </div>
        <div className='wlcmTxt'>
          <h3> Choose any Login method</h3>
        </div>
        <Steam />
        <div className='signIn'>
          <LoginSocialGoogle //Google login uising LoginSocialGoogle(npm package)
            client_id={`${process.env.REACT_APP_CLIENT_ID}`}
            scope='openid profile email'
            discoveryDocs='claims_supported'
            access_type='offline'
            onResolve={({ provider, data }) => {
              setLoginObj(data);
              sessionStorage.setItem(
                'userDetails',
                JSON.stringify({
                  email: data.email,
                  name: data.name,
                  family_name: data.family_name,
                  given_name: data.given_name,
                  picture: data.picture,
                  sub: data.sub,
                  access_token: data.access_token,
                })
              );
              navigate('/'); //navigate to home page after sucessfull login
            }}
            onReject={(err) => {
              alert('Failed to login');
              console.log(err, 'Failed');
            }}
          >
            <button className='loginBtn'>
              <FcGoogle className='g signInIcons' size={25} />
              Login with Google
            </button>
          </LoginSocialGoogle>

          <button className='loginBtn'>
            <GoMarkGithub className='gh signInIcons' size={25} />
            Login with GitHub
          </button>
          <button className='loginBtn'>
            <SiFacebook className='fb signInIcons' size={25} />
            Login with Facebook
          </button>
        </div>
        <div className='signInTxt signIn'>
          All you personl detials are safe with us.
        </div>
      </div>
    </div>
  );
};
export default Login;
