import './itemDetails.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../../images/loading.svg';
import { useNavigate } from 'react-router-dom';

const ItemDetails = () => {
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [product, setProduct] = useState(null);
  const [save, setSave] = useState(false);

  const url = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_LOCALHOST}:${process.env.REACT_APP_PORT}/${process.env.REACT_APP_ADDRESS}/items/${id}`;

  const urlItemPg = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_LOCALHOST}:${process.env.REACT_APP_PORT}/${process.env.REACT_APP_ADDRESS}/itemDetail`;

  const user = JSON.parse(sessionStorage.getItem('userDetails')).email;
  const access_token = JSON.parse(
    sessionStorage.getItem('userDetails')
  ).access_token;

  //Fuction to save the dava into saved items of user
  const saveData = async () => {
    try {
      await fetch(`${urlItemPg}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ user }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          access_token: access_token,
        },
      });
    } catch (err) {
      console.log('Error -', err);
    }
  };
  //calling the function  to save item'data
  const saveItem = () => {
    if (save !== 'Saved') {
      if (count >= 5) alert('cannot save more than 5 items');
      else {
        setSave('Saved');
        saveData();
      }
    } else if (save === 'Saved') navigate('/user');
  };

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setProduct(data.data.item);
      } catch (error) {
        console.log('error', error);
      }
    };
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${urlItemPg}/${user}`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: access_token,
          },
        });
        const data = await response.json();
        const savedProducts = await data.saves;
        // console.log(savedProducts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setCount(data.saves.length);
        if (savedProducts.find((i) => i === id)) setSave('Saved');
      } catch (error) {
        console.log(error);
      }
    };
    fetchItemData();
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!product)
    return (
      <>
        <div id='loader'>
          <img className='loader' src={Loading} alt='loaing...' />
        </div>
      </>
    );
  return (
    <>
      <div className='items'>
        <div className='imgItemDetail itemDetailBox'>
          <img className='imgItemTag' src={product.image} alt='' />
        </div>
        <div className='infoItem itemDetailBox'>
          <div className='info1'>
            <p className='infoA br'>{product.product}</p>
            <p className='infoA br'>
              ₹{product.price} per {product.unit}
            </p>
          </div>
          <div className='info2'>
            <div className='txtA'>
              <p className='infoB br'>Owner: </p>
              <p className='infoB or' id='name'>
                {product.owner}
              </p>
            </div>
            <div className='txtA'>
              <p className='infoB br'>Contact: </p>
              <p className='infoB or' id='contact'>
                {product.contact}
              </p>
            </div>
            <div className='txtA'>
              <p className='infoB br'>Lpu id: </p>
              <p className='infoB or' id='lpuId'>
                {product.lpuid}
              </p>
            </div>
          </div>

          <div className='info3'>
            <p className='infoC   '>{product.description}</p>
          </div>
        </div>
      </div>
      <div id='save'>
        <button className='save btn' onClick={saveItem}>
          {save ? 'Saved' : 'Save'}
        </button>
      </div>
    </>
  );
};

export default ItemDetails;
