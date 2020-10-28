const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const companySchema = new Schema({
	companyName: 	  	{ type: String, required: true },
	companyDescription:	{ type: String, required: true },
	industry:  	  		{ type: String, required: true },
	img: 			  	{ type: String },
	fakeId: 		  	{ type: Number }
});

mongoose.model('Company', companySchema);