import { useNavigate } from 'react-router-dom';
import './userDetails.css';
import UserProfile from '../../components/UserProfile/UserProfile';

//This component is child of login.jsx
const UserDetails = ({ picture, name }) => {
  const navigate = useNavigate();
  const handleLogOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('userDetails');
    navigate('/');
  };

  return (
    <>
      <div className='logInfo'>
        <div className='wlcm'>
          <div className='wlcmMsg'>
            <p>Logged in as</p>
          </div>
          <div id='userPicName'>
            <p className='or' id='userName'>
              {name}
            </p>
            <div id='userPic'>
              <img className='userPic' src={picture} alt='' />
            </div>
          </div>
        </div>
        <div id='logOut'>
          <button className='logOut' onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
      <UserProfile />
    </>
  );
};
export default UserDetails;
