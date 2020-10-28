const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const Player = mongoose.model('Player');
const teamData = require('../../team-data');

const getTeams = (req, res) =>{
	Team.find((err, teams)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { teams: teams });
	});
}

const createTeam = ({ body }, res)=>{
    if(!body.name) { return res.statusJson(400, { message: "Missing name for the team" });}
	let team = {
		name: body.name,
		fakeid: body.fakeid
	}
	Team.create(team, (err, newTeam)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { newTeam: newTeam });
	});
}

const getTeam = ({ params }, res) =>{
	Team.findOne( { fakeid: params.playerid }, (err, team)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { team: team });
	});
}

const updateTeam = ({ body, params }, res)=>{
    if(!body.name) { return res.statusJson(400, { message: "Missing name for the team" }); }

	Team.findOne({ fakeid: params.playerid }, (err, team)=>{
		if(err) { res.send({ error: err }); }
		if(!team) { return res.statusJson(404, { message: "Team could not be found" }); }

		Team.name = body.name;
		Team.save((err, updatedTeam)=>{
			if(err) { res.send({ error: err }); }

			res.statusJson( 200, { team: updatedTeam });
		});
	});
}

const deleteTeam = ({ params }, res)=>{
	Team.findByIdAndRemove(params.playerid, (err, teamDeleted)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { teamDeleted: teamDeleted });
	});
}

const resetTeams = (req, res)=>{
	let playerz;
	let p1 = new Promise((resolve, reject)=>{
		Player.find((err, players)=>{
			if(err) { reject('Error'); res.send({ error: err }); }
			playerz = players;
			resolve('Success');
		});
	});
	p1.then(()=>{
		Team.deleteMany((err, info)=>{
	        if(err) { return res.json({ error: err }); }
	        teamData.forEach((team)=>{
	        	let tempPlayers = [];
	        	playerz.forEach((player)=>{
	        		if(player.team === team.name){
	        			tempPlayers.push(player);
	        		}
	        	});
	        	team.players = tempPlayers;
	        });
	        Team.insertMany(teamData, (err, teams)=>{
	        	if(err) { return res.json({ error: err }); }
				res.statusJson( 200, { teams: teams });
	    	});
	    });
	});
}

module.exports= {
	getTeams,
	createTeam,
	getTeam,
	updateTeam,
	deleteTeam,
	resetTeams
}