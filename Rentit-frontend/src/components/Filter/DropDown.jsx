import React from 'react';
import './DropDown.css';
import { useGlobalContext } from '../../Context';

const Dropdown = () => {
  const { setReqParams, selectedOption, setSelectedOption } =
    useGlobalContext();
  const handleChange = (event) => {
    setReqParams((prevQuery) => {
      return { ...prevQuery, type: event.target.value };
    });
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <div className='dropDown'>
        <select id='category' value={selectedOption} onChange={handleChange}>
          <option className='option' value=''>
            All
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
          <option className='option' value='accessories'>
            Accessories
          </option>
          <option className='option' value='others'>
            Others
          </option>
        </select>
      </div>
    </>
  );
};

export default Dropdown;
