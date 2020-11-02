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

module.exports = upload;