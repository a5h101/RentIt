/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './rent.css';
import { TbCameraPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import Loading from '../../images/loading.svg';
import User from '../login/login';
import { CiCircleRemove } from 'react-icons/ci';
import { ToastContainer, toast } from 'react-toastify';
// import AppFooter from '../../components/Footer/AppFooter';
import 'react-toastify/dist/ReactToastify.css';

const EditPost = () => {
  const [values, setValues] = useState({}); //To store the form inputs
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const url = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_LOCALHOST}/${process.env.REACT_APP_ADDRESS}/rent/edit`;
  const location = useLocation();

  //Set the feilds to existing values when the page loads
  useEffect(() => {
    if (location.state?.data) {
      const { image, ...otherValues } = location.state.data;
      setValues(otherValues);
    } else navigate('/');
  }, []);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e) => {
    const image = e.target.files[0];
    if (!/^image\/(jpeg|png)$/.test(image.type)) {
      toast.error('Please upload a JPEG or PNG image.', {
        position: 'bottom-right',
      });
      return;
    }
    if (image.size > 1097152) {
      toast.error('Please upload an image that is less than 2MB.', {
        position: 'bottom-right',
      });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Image = reader.result;
      setValues({
        ...values,
        image: base64Image,
      });
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  };
  const compareEditToOriginal = (values, newValues) => {
    for (const key in newValues) {
      if (values[key] !== newValues[key]) {
        return false;
      }
    }
    return true;
  };

  //To post the edited post
  const handlePost = async (e) => {
    e.preventDefault();
    //Return if no changes have been made
    if (compareEditToOriginal(location.state.data, values)) {
      toast.error('No changes made', {
        position: 'bottom-right',
      });
      return;
    }
    if (!values.image && !location.state.data.image) {
      toast.error('Please add an image', {
        position: 'bottom-right',
      });
      return;
    }
    try {
      setLoader(true);
      const response = await fetch(`${url}/${location.state.id.id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          access_token: JSON.parse(sessionStorage.getItem('userDetails'))
            .access_token,
          sub: JSON.parse(sessionStorage.getItem('userDetails')).sub,
        },
      });
      setLoader(false);
      if (response.status === 200) {
        alert('Edited sucesfully');
        navigate(`/itemDetails/${location.state.id.id}`);
      } else if (response.status) {
        alert('Failed to edit due to some issue');
      }
    } catch (err) {
      console.log('Error -', err);
      setLoader(false);
    }
  };
  //To remove the uploaded image on front-end
  const handleImg = () => {
    setValues({
      ...values,
      image: null,
    });
    location.state.data.image = null;
  };
  if (!sessionStorage.getItem('userDetails')) return <User />;
  else if (loader) {
    return (
      <>
        <div id='loader'>
          <img className='loader' src={Loading} alt='loading...' />
        </div>
      </>
    );
  }
  if (
    !sessionStorage.getItem('userDetails') ||
    !location.state ||
    !location.state.data
  ) {
    navigate('/');
    return <></>;
  }
  return (
    <div className='rent-pg-wrap'>
      <ToastContainer />
      <div className='rentHeading heading'>What do you want to rent ?</div>
      <form onSubmit={handlePost}>
        <div className='rentForm'>
          <div className='detail1'>
            <div className='or titles'>Product detials</div>
            <div className='detailA'>
              Title*
              <div className='rentTitle wrapBox'>
                <input
                  className='rentBox'
                  onChange={handleChange}
                  maxLength={25}
                  minLength={3}
                  name='product'
                  title='Minimum 3 and maximun 25 words'
                  defaultValue={values.product}
                  required
                />
              </div>
            </div>
            <div className='detailA'>
              Description*
              <div className='rentDes wrapBox'>
                <textarea
                  maxLength={230}
                  minLength={10}
                  className='rentBox des'
                  onChange={handleChange}
                  name='description'
                  title='Minimum 10 and maximun 100 words'
                  defaultValue={values.description}
                  required
                />
              </div>
            </div>
            <div className='detailImg'>
              <label className='detailA upload'>
                <TbCameraPlus
                  title='Upload image'
                  className='camera'
                  size={28}
                />
                <input
                  id='input'
                  type='file'
                  accept='/^image\/(jpeg|png)'
                  onChange={handleFileUpload}
                  name='image'
                  title='Uploading image is compulsory'
                ></input>
              </label>
              <div className='urlImg wrapBox imgBox '>
                <>
                  {(values.image || location.state.data.image) && (
                    <div className='imgUploadSection'>
                      <img
                        className='uploadImg'
                        src={
                          values.image
                            ? values.image
                            : location.state.data.image
                        }
                        alt=''
                      />
                      <CiCircleRemove
                        className='removeImg'
                        onClick={handleImg}
                        size={20}
                      />
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
          <div className='line' id='lineRent'></div>
          <div className='detail2'>
            <div className='or titles'>Add your details</div>
            <div className='detailB'>
              Name*
              <div className='rentName wrapBox'>
                <input
                  type='text'
                  maxLength={25}
                  minLength={3}
                  className='rentBox'
                  onChange={handleChange}
                  required
                  name='owner'
                  title='Minimum 3 and maximun 25 words'
                  defaultValue={values.owner}
                />
              </div>
            </div>
            <div className='detailB'>
              LPU ID*
              <div className='rentID wrapBox'>
                <input
                  className='rentBox'
                  onChange={handleChange}
                  name='lpuid'
                  pattern='[0-9]{8}'
                  title='Eight digit numeric ID only'
                  defaultValue={values.lpuid}
                  required
                />
              </div>
            </div>
            <div className='detailB'>
              Contact*
              <div className='rentMob wrapBox'>
                <input
                  className='rentBox'
                  onChange={handleChange}
                  name='contact'
                  pattern='[0-9]{10}'
                  title='10 digit mobile number'
                  defaultValue={values.contact}
                  required
                />
              </div>
            </div>
          </div>
          <div className='line' id='lineRent'></div>
          <div className='detail4'>
            <div className=' or titles type'>Product Category</div>
            <div className='unitBox chargeBox '>
              <select
                name='type'
                id='type'
                className='rentBox unitBox'
                onChange={handleChange}
                required
                value={values.type}
                title='choose category'
              >
                <option value=''>Select an option</option>

                <option className='option' value='accessories'>
                  Accessory
                </option>
                <option className='option' value='electronics'>
                  Electronics
                </option>
                <option className='option' value='sports'>
                  Sports
                </option>
                <option className='option' value='clothes'>
                  Clothes
                </option>
                <option className='option' value='hardware'>
                  Hardware
                </option>
                <option className='option' value='others'>
                  Others
                </option>
              </select>
            </div>
          </div>
          <div className='line' id='lineRent'></div>
          <div className='detail3'>
            <div className=' or titles'>Renting Charges</div>
            <div className='rentCharge  chargeBox wrapBox'>
              <div className='chargeBox'>
                <input
                  placeholder='Rs.'
                  className='rentBox priceBox'
                  onChange={handleChange}
                  name='price'
                  pattern='[0-9]{1,4}'
                  title='Price shoud be between 1-9999'
                  defaultValue={values.price}
                  required
                />
              </div>
              <div className='unitBox chargeBox '>
                <select
                  name='unit'
                  id='unit'
                  className='rentBox unitBox'
                  onChange={handleChange}
                  title='choose charge type'
                  value={values.unit}
                  required
                >
                  <option value=''>Select an option</option>
                  <option value='day'>Per day</option>
                  <option value='hour'>Per hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div id='post'>
          <button className='post btn'>Save</button>
        </div>
      </form>
      {/* <AppFooter /> */}
    </div>
  );
};
export default EditPost;
