const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../../uploads');
module.exports = (req, res, next)=>{
					if (process.env.NODE_ENV === 'production') {
				        next();
					}else {
						fs.readdir(directory, (err, files)=>{
						   	if(err) throw err;
					        	for (const file of files) {
					        		fs.unlink(path.join(directory, file), err=>{
					        			if(err) throw err;
					        		});
					        	}
					        });
				        next();
					}
				};