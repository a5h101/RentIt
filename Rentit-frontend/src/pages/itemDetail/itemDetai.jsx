import './itemDetail.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../../images/loading.svg';

const ItemDetail = () => {
  const location = useLocation();
  const id = location.state.id;
  const [product, setProduct] = useState(null);
  const [save, setSave] = useState(false);
  const url = `http://127.0.0.1:2000/api-rentit/v1/items/${id}`;

  const saveItem = () => {
    setSave('saved');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setProduct(data.data.item);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();

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

export default ItemDetail;
