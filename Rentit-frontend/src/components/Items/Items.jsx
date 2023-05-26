/* eslint-disable react-hooks/exhaustive-deps */
import './Items.css';
import { useEffect, useState } from 'react';
import Loading from '../../images/loading.svg';
import ItemCard from './ItemCard';
import { useGlobalContext } from '../../Context';
import unhappy from '../../images/unhappy.svg';

const Items = () => {
  const [user, setUser] = useState(null);
  const { searching, queryData } = useGlobalContext();

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('userDetails')));
  }, []);

  //To activate loading screen when data is not there to display or search is going on
  if (queryData === null || searching)
    return (
      <div className='items-wrap'>
        <div id='loader'>
          <img className='loader' src={Loading} alt='loading...' />
        </div>
      </div>
    );
  //To display main results
  else if (queryData && queryData.length) {
    return (
      <div className='items-wrap'>
        <div className='allItems'>
          {queryData.map((data, index) => {
            return <ItemCard key={index} data={data} user={user} />;
          })}
        </div>
      </div>
    );
  }
  //To show empty search
  return (
    <div className='items-wrap'>
      <div className='unhappy'>
        <img id='unhappy' src={unhappy} alt='' />
      </div>
      <div className='searchMsg'>Sorry,</div>
      <div className='searchMsg'>No results found.</div>
    </div>
  );
};

export default Items;
