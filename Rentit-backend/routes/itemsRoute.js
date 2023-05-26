const express = require('express');
const router = express.Router();
const {
  getItemDetails,
  getItems,
  deleteItem,
  getSearchResults,
  // getFilteredResults,
} = require('../controllers/itemsPageContoller');
// const { route } = require('./userRoute');

router.route('/').get(getItems);
// router.route('/search/:term').get(getSearchResults);
// router.route('/filter/:id').get(getFilteredResults);
router.route('/:id').get(getItemDetails);
router.route('/:id/:type').delete(deleteItem);

module.exports = router;
