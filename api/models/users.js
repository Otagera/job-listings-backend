const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
	email: 		{
					type: String,
					required: true,
					unique: true,
					match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
				},
	password: 	{ type: String, required: true }
});

mongoose.model('User', userSchema);