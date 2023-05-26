import React from 'react';
import './Sort.css';
import { useGlobalContext } from '../../Context';

const DropdownSort = () => {
  const { selectedSort, setSelectedSort, setReqParams } = useGlobalContext();
  const handleChange = (event) => {
    setSelectedSort(event.target.value);
    setReqParams((prevQuery) => {
      return { ...prevQuery, sort: event.target.value };
    });
  };

  return (
    <>
      <div className='dropDown-sort'>
        <select id='category-sort' value={selectedSort} onChange={handleChange}>
          <option className='option' value={''}>
            Uploads: Latest
          </option>
          <option className='option' value={'createdAt'}>
            Uploads: Oldest
          </option>
          <option className='option' value={'-likes'}>
            Likes: High to Low
          </option>
          <option className='option' value={'likes'}>
            Likes: Low to High
          </option>
        </select>
      </div>
    </>
  );
};

export default DropdownSort;
