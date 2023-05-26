/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';

const AppContext = React.createContext();

//Defining provider function to provide data to any components wrapped inside it
const AppProvider = ({ children }) => {
  const [reqParams, setReqParams] = useState({
    type: '',
    search: '',
    sort: '',
  });
  const [loginObj, setLoginObj] = useState(null); //Current user's login data
  const [savesCount, setSavesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); //Store the searched term
  // const [searchData, setSearchData] = useState(null); //Store search results
  const [searching, setSearching] = useState(false); //To handle loader while search
  const [selectedOption, setSelectedOption] = useState(''); //To handle filter
  const [selectedSort, setSelectedSort] = useState('');
  // const [filteredData, setFilteredData] = useState(null);
  const [queryData, setQueryData] = useState(null);

  const url = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_LOCALHOST}/${process.env.REACT_APP_ADDRESS}/items`;
  const urlSaveUSer = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_LOCALHOST}/${process.env.REACT_APP_ADDRESS}/user`;

  //To store the user's data in DB after login
  useEffect(() => {
    const saveUser = async () => {
      try {
        const response = await fetch(urlSaveUSer, {
          method: 'POST',
          body: JSON.stringify(loginObj),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer ' + loginObj.access_token,
          },
        });
        const data = await response.json();
        //Get user's login data from session storage and add access token and user's DB id to it
        const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
        userDetails._id = data.data._id;
        sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
      } catch (err) {
        throw new Error('Failed to Login', err);
      }
    };
    //After getting user's data give a call to save it
    if (loginObj) saveUser();
  }, [loginObj]);

  //After getting a query from user or when the app loads
  useEffect(() => {
    const getQuery = async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `${url}/?${reqParams.type ? `type=${reqParams.type}` : ''}&search=${
            reqParams.search
          }&sort=${reqParams.sort}`
        );
        const data = await response.json();
        setQueryData(data.data.items);
        setSearching(false);
      } catch (error) {
        setSearching(false);
        throw new Error('failed to execute', error);
      }
    };

    if (reqParams) {
      // if (reqParams.filter || reqParams.search || reqParams.sort) {
      getQuery();
      // }
    }
  }, [reqParams]);

  //Pass all states as props to all child components
  return (
    <AppContext.Provider
      value={{
        reqParams,
        setReqParams,
        loginObj,
        setLoginObj,
        savesCount,
        setSavesCount,
        postsCount,
        setPostsCount,
        searchTerm,
        setSearchTerm,
        searching,
        setSearching,
        selectedOption,
        setSelectedOption,
        selectedSort,
        setSelectedSort,
        queryData,
        setQueryData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
//This fuction will be used by children to get current app context
export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
