const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');

cloudinary.config({
	cloud_name: 'lenxo',
	api_key: '432723375944148',
	api_secret: 'JSDqr-nva3H92LFl-AktW0y5MZ4'
});

let storage = null;

if (process.env.NODE_ENV === 'production') {
    storage = new CloudinaryStorage({
		cloudinary: cloudinary,
		params: async (req, file)=>{
			return {
				folder: 'job-listings/uploads',
				allowedFormat:   ['svg', 'jpg', 'png'],
				public_id: new Date().toISOString().replace(/:/g, '-') + file.originalname
			};
		}
	});
}else {
	storage = multer.diskStorage({
		destination: function(req, file, cb) {
			fs.mkdir('./uploads/', (err)=>{
				cb(null, './uploads/');
			});
		},
		filename: function(req, file, cb) {
			cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
		}
	});
}
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