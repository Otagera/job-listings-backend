let express = require('express');
let router = express.Router();

let indexCtrl = require('../controllers/index');
let listingCtrl = require('../controllers/listing');
let companyCtrl = require('../controllers/company');

const checkAuth = require('../middlewares/check-auth.js');
const upload = require('../middlewares/multer');
const clearUploadsFolder = require('../middlewares/clearUploadsFolder');
const apiGuard = require('../middlewares/apiGuard');

/* GET home page. */
router.route('/')
	  .get(indexCtrl.getIndex);

//get all, post(create new) and delete listings
router.route('/listings')
	  .get(listingCtrl.getListings)
	  .post(upload.single('img'), checkAuth, listingCtrl.createListing)
	  .delete(apiGuard, checkAuth, listingCtrl.deleteListings);
router.route('/listings/:companyid')
	  .get(listingCtrl.getListingsByCompany)
//get, put (edit), delete a partucilar listing using the the listing fakeid
router.route('/listing/:listingid')
	  .get(listingCtrl.getListing)
	  .put(apiGuard, checkAuth, listingCtrl.updateListing)
	  .delete(apiGuard, checkAuth, listingCtrl.deleteListing);
//upload.array('files', 10)
router.route('/reset-listings').get( listingCtrl.resetListings);
	
//get all, post(create new) and delete companies
router.route('/companies')
	  .get(companyCtrl.getCompanies)
	  .post(upload.single('img'), checkAuth, companyCtrl.createCompany)
	  .delete(apiGuard, checkAuth, companyCtrl.deleteCompanies);
//get, put (edit), delete a partucilar listing using the the company fakeid
router.route('/company/:companyid')
	  .get(companyCtrl.getCompany)
	  .put(apiGuard, checkAuth, companyCtrl.updateCompany)
	  .delete(apiGuard, checkAuth, companyCtrl.deleteCompany);
router.route('/reset-companies').get(clearUploadsFolder, upload.fields([
											{name: 'photosnapImg', maxCount: 1}/*,
											{name: 'manageImg', maxCount: 1},
											{name: 'accountImg', maxCount: 1},
											{name: 'myHomeImg', maxCount: 1},
											{name: 'loopStudiosImg', maxCount: 1},
											{name: 'faceItImg', maxCount: 1},
											{name: 'shortlyImg', maxCount: 1},
											{name: 'insureImg', maxCount: 1},
											{name: 'eyecamImg', maxCount: 1},
											{name: 'airFilterImg', maxCount: 1}*/
										]), companyCtrl.resetCompanies);
//put, post, delete
module.exports = router;
