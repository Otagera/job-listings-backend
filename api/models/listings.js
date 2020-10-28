const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const listingSchema = new Schema({
	isThereNew:	 	  { type: Boolean, default: false },
	isFeatured:  	  { type: Boolean, default: false },
	jobTitle: 	 	  { type: String, required: true },
	jobSummary:	 	  { type: String, required: true },
	howOld: 	 	  { type: String, required: true },
	dateCreated: 	  { type: Date, default: Date.now() },
	typeOfEmployment: { type: String, required: true },
	location: 		  { type: String, required: true },
	role: 			  { type: String, required: true },
	level: 			  { type: String, required: true },
	lengthOfExp:	  { type: String, required: true },
	languages: 		  [{ type: String }],
	tools: 			  [{ type: String }],
	salary:			  { type: Number },
	company: 		  { type: Schema.Types.ObjectId, ref: 'Company' },
	fakeId: 		  { type: Number }
});

mongoose.model('Listing', listingSchema);