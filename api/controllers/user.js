const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSignUp = (req, res)=>{
	User.find({ email: req.body.email }).exec().then(user=>{
		if(user.length >= 1) {
			return res.statusJson(409, { message: 'Sorry this email exists' })
		}else {
			bcrypt.hash(req.body.password, 10, (err, hash)=>{
				if(err){ return res.statusJson(500, { error: err }); }
				else {
					const user = new User({
						email: req.body.email,
						password: hash
					});	
					user.save().then(result=>{
						return res.statusJson(201, {message: 'User Created', user: user });
					}).catch(err=>{
						console.log(err);
						return res.statusJson(500, { error: err });
					});		
				}
			});
		}
	});
}

const userLogin = (req, res)=>{
	User.find({ email: req.body.email })
		.exec()
		.then(user=>{
			if(user.length < 1){
				return res.statusJson(401, { message: 'Auth failed' });
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
				if(err) { return res.statusJson(401, { message: 'Auth failed' }); }
				if(result){
					//remember to set up env{nodemon.json)} file and replace process.env.JWT_KEY
					let JWT_KEY = 'secret';
					const token = jwt.sign(
						{
							email: user[0].email,
							userId: user[0]._id
						},
						JWT_KEY,
						{
							expiresIn: '48h'
						});
					return res.statusJson(200, { message: 'Auth successful', token: token })
				}
				return res.statusJson(401, { message: 'Auth failed' });
			})
		})
		.catch(err=>{
			console.log(err);
			return res.statusJson(500, { error: err });
		});
}

const userDelete = (req, res)=>{
	User.remove({ _id: req.params.userid })
		.exec()
		.then(result=>{
			return res.statusJson(200, { message: 'User deleted' });
		})
		.catch(err=>{
			console.log(err);
			return res.statusJson(500, { error: err });
		});
}

module.exports= {
	userSignUp,
	userLogin,
	userDelete
}