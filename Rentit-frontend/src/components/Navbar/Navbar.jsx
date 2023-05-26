/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import './Navbar.css';
import logo from '../../images/Logo.svg';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useGlobalContext } from '../../Context';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const {
    setSearchTerm,
    setSelectedOption,
    setSelectedSort,
    loginObj,
    setReqParams,
    setQueryData,
  } = useGlobalContext();

  const searchText = useRef('');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [searched, setSearched] = useState(false);
  let data = null;
  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && searchText.current.value.trim()) {
        handleSearch();
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(
    () => {
      if (loginObj) {
        checkLogin();
      }
    },
    [],
    [loginObj]
  );

  const checkLogin = () => {
    if (sessionStorage.getItem('userDetails')) {
      data = JSON.parse(sessionStorage.getItem('userDetails'));
      return true;
    } else return false;
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchText.current.value) {
      navigate('/');
      setReqParams((prevQuery) => {
        return { ...prevQuery, search: searchText.current.value };
      });
      setSearched(true);
    } else return;
  };

  const handleGoHome = () => {
    setSearchTerm(null);
    setSearched(false);
    setReqParams({
      type: '',
      search: '',
      sort: '',
    });
    setQueryData(null);
    setSelectedOption('');
    setSelectedSort('');
    searchText.current.value = '';
  };
  return (
    <>
      <div className='navbar'>
        <div id='logo'>
          <Link to='/'>
            <img
              className='logo'
              src={logo}
              alt='logo'
              onClick={handleGoHome}
            />
          </Link>
        </div>
        <div className='searchBox search'>
          <button
            onClick={handleSearch}
            type='submit'
            className='searchBtn buttom search'
          >
            <FaSearch className={searched ? 'search or' : 'search'} size={19} />
          </button>
          <input
            type='text'
            className='searchBar '
            placeholder='Search'
            ref={searchText}
          />
        </div>
        <div className='navBtns'>
          <div className='buttonName'>
            <div className='login-box' name='login'>
              {checkLogin() ? (
                <>
                  <img
                    name='login'
                    className='profile'
                    src={data.picture}
                    alt='profile'
                    onClick={() => navigate('/user')}
                  />
                  {screenWidth >= 858 ? (
                    <div
                      className='login'
                      onClick={() => navigate('/user')}
                    >{`Hi, ${data.given_name}`}</div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div
                  className='login'
                  name='login'
                  onClick={() => navigate('/user')}
                >
                  Login
                </div>
              )}
            </div>
          </div>
          <button
            className='rent btn button'
            name='rent'
            onClick={() =>
              checkLogin() ? navigate('/rent') : navigate('/user')
            }
          >
            Rent
          </button>
        </div>
      </div>
    </>
  );
};
export default Navbar;
