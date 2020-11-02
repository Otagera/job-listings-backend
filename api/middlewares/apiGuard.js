const apiGuard = (req, res, next)=>{
	/* if(res.get('host') !== 'localhost:3000'){
		res.statusJson(404, { error: 'Cannot Create, Update or Delete countries from the API while in production'});
	} else { */
		next();
	// }
}
module.exports = apiGuard