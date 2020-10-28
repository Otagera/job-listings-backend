const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Player = mongoose.model('Player');

mongoose.set('useCreateIndex', true);

const teamSchema = new Schema({
	name: 	 { 
		type: String,
		required: true
	},
	players: [{
		player: { type: Schema.Types.ObjectId, ref: 'Player' }
	}],
	fakeid: {
		type: Number,
		required: true,
		unique: true
	}
});

mongoose.model('Team', teamSchema);