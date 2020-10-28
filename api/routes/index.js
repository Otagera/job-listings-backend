let express = require('express');
let router = express.Router();

let indexCtrl = require('../controllers/index');
let listingCtrl = require('../controllers/listing');
let companyCtrl = require('../controllers/company');

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		fs.mkdir('./uploads/', (err)=>{
			cb(null, './uploads/');
		});
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});

const filefilter = (req, file, cb)=>{
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml'){
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	filefilter: filefilter
});
let apiGuard = (req, res, next)=>{
	/* if(res.get('host') !== 'localhost:3000'){
		res.statusJson(404, { error: 'Cannot Create, Update or Delete countries from the API while in production'});
	} else { */
		next();
	// }
}

/* GET home page. */
router.route('/')
	  .get(indexCtrl.getIndex);

//get all, post(create new) and delete listings
router.route('/listings')
	  .get(listingCtrl.getListings)
	  .post(upload.single('img'), listingCtrl.createListing)
	  .delete(apiGuard, listingCtrl.deleteListings);
router.route('/listings/:companyid')
	  .get(listingCtrl.getListingsByCompany)
//get, put (edit), delete a partucilar listing using the the listing fakeid
router.route('/listing/:listingid')
	  .get(listingCtrl.getListing)
	  .put(apiGuard, listingCtrl.updateListing)
	  .delete(apiGuard, listingCtrl.deleteListing);
//upload.array('files', 10)
router.route('/reset-listings').get( listingCtrl.resetListings);
	
//get all, post(create new) and delete companies
router.route('/companies')
	  .get(companyCtrl.getCompanies)
	  .post(upload.single('img'), companyCtrl.createCompany)
	  .delete(apiGuard, companyCtrl.deleteCompanies);
//get, put (edit), delete a partucilar listing using the the company fakeid
router.route('/company/:companyid')
	  .get(companyCtrl.getCompany)
	  .put(apiGuard, companyCtrl.updateCompany)
	  .delete(apiGuard, companyCtrl.deleteCompany);
router.route('/reset-companies').get((req, res, next)=>{
					        fs.readdir(directory, (err, files)=>{
					        	if(err) throw err;

					        	for (const file of files) {
					        		fs.unlink(path.join(directory, file), err=>{
					        			if(err) throw err;
					        		});
					        	}
					        });
					        next();
						},	upload.fields([
											{name: 'photosnapImg', maxCount: 1},
											{name: 'manageImg', maxCount: 1},
											{name: 'accountImg', maxCount: 1},
											{name: 'myHomeImg', maxCount: 1},
											{name: 'loopStudiosImg', maxCount: 1},
											{name: 'faceItImg', maxCount: 1},
											{name: 'shortlyImg', maxCount: 1},
											{name: 'insureImg', maxCount: 1},
											{name: 'eyecamImg', maxCount: 1},
											{name: 'airFilterImg', maxCount: 1}
										]), companyCtrl.resetCompanies);
//put, post, delete
module.exports = router;
