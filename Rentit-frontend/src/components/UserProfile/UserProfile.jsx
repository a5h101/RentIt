/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context';
import './UserProfile.css';
import ProductCard from './ProductCard';

const UserProfile = () => {
  //   const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState([]); //Storing array of saves
  const [posts, setPosts] = useState([]); //Storing the array of posts
  const [highlight, setHighlight] = useState(0); //Adding highlight to active Tab
  const [loader, setLoader] = useState(false); //To display loader
  const { savesCount, setSavesCount, postsCount, setPostsCount } =
    useGlobalContext();
  const user = JSON.parse(sessionStorage.getItem('userDetails')).sub;
  const access_token = JSON.parse(
    sessionStorage.getItem('userDetails')
  ).access_token;
  const url = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_LOCALHOST}/${process.env.REACT_APP_ADDRESS}/user`;

  //When page loads fetch all saved and posted products
  useEffect(() => {
    //Fetch the array of saved products with matching
    const fetchSaves = async () => {
      setLoader(true);
      const response = await fetch(`${url}/${user}`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: access_token,
        },
      });
      const data = await response.json();
      setSavedProducts(data.saves);
      setLoader(false);
    };
    //Fetch the all posts with matching email
    const fetchPosts = async () => {
      const response = await fetch(`${url}/posts/${user}`, {
        headers: {
          'Content-Type': 'application/json',
          access_token: access_token,
        },
      });
      const data = await response.json();
      setPosts(data.data.posts);
    };
    fetchSaves().then(fetchPosts()); //Fetch saved prods then remove loader and fetch posts
  }, []);

  useEffect(() => {
    savedProducts
      ? setSavesCount(savedProducts.length)
      : setSavedProducts(null);
  }, [savedProducts]);
  useEffect(() => {
    posts ? setPostsCount(posts.length) : setPosts(null);
  }, [posts]);

  const addHighlight = (index) => setHighlight(index); //Highlight the active tab

  return (
    <>
      <div className='container'>
        {/* tab-1 */}
        <div
          className={
            highlight === 0 ? `box-1 tab highlight` : `box-1 tab unactive`
          }
          onClick={() => addHighlight(0)}
        >
          Saved Products
        </div>
        {/* tab-1 */}
        {/* tab-2 */}
        <div
          className={
            highlight === 1 ? `box-2 tab highlight` : `box-2 tab unactive`
          }
          onClick={() => addHighlight(1)}
        >
          Posted Products
        </div>
        {/* tab-2 */}
      </div>

      <div className='user-prods-wrap'>
        <div className={highlight === 0 ? 'saves fade-in' : 'hide'}>
          {loader ? (
            <div className='loading-txt'>Loading...</div>
          ) : savesCount > 0 && savesCount !== null ? (
            savedProducts.map((data, index) => {
              if (data)
                return <ProductCard key={index} data={data} type={'saves'} />;
              else return null;
            })
          ) : (
            'No products saved'
          )}
        </div>

        <div className={highlight === 1 ? 'saves fade-in' : 'hide'}>
          {loader ? (
            <div className='loading-txt'>Loading...</div>
          ) : postsCount > 0 && postsCount !== null ? (
            posts.map((data, index) => {
              if (data)
                return <ProductCard key={index} data={data} type={'posts'} />;
              else return null;
            })
          ) : (
            'No products posted'
          )}
        </div>
      </div>
    </>
  );
};
export default UserProfile;
