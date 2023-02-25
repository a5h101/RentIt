import './items.css';
// import itemImg from '../../images/itemImg.svg';
import { Link } from 'react-router-dom';
import fakedata from '../../fakedata.json';
const Items = () => {
  return (
    <>
      <div className="allItems">
        {fakedata &&
          fakedata.map(data => {
            return (
              <Link to="itemDetail">
                <div className="item" key={data.id}>
                  <div id="itemImgBox">
                    <img className="imgItem" src={data.image} alt="cover" />
                  </div>
                  <div className="line lineItems"></div>
                  <div className="itemInfo">
                    <div className="itemName">
                      <span>{data.product}</span>
                    </div>
                    <div className="itemDetail">{data.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
};
export default Items;
