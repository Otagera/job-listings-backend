const jwt = require('jsonwebtoken');

//remember to set up env{nodemon.json)} file and replace process.env.JWT_KEY
let JWT_KEY = 'secret';

module.exports = (req, res, next)=>{
	try{
		let token = req.headers['x-access-token'] || req.headers.authorization;
		if(token.startsWith('Bearer ')){
			token = token.split(" ")[1];
		}
		
		const decoded = jwt.verify(token, JWT_KEY);
		req.decoded = decoded;
		next();
	}catch(error){
		return res.statusJson(401, { message: 'Auth failed' });
	}
};