import Items from '../../components/Items/Items';
import Backtotop from '../../components/BackToTop/Backtotop';
import DropdownSort from '../../components/Sort/Sort';
import Dropdown from '../../components/Filter/DropDown';
import './home.css';

const Home = () => {
  return (
    <>
      <main>
        <div id='dropdowns'>
          <Dropdown />
          <DropdownSort />
        </div>
        <Backtotop />
        <Items />
      </main>
    </>
  );
};

export default Home;
