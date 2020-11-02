const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const companyData = require('../models/company-data');

const getCompanies = (req, res) =>{
	Company.find((err, companies)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { companies: companies });
	});
}
const createCompany = ({ body, file }, res)=>{
	//console.log(body);
    if(!body.companyName
    		|| !body.companyDescription
    		|| !body.industry) {
    	return res.statusJson(400, { 
    		message: "Missing either the company name, company description, or industry" 
    	});
    }
    Company.find({}, null, { sort: {fakeId: 1}}, (err, companies)=>{
		if(err){
			return res.statusJson(500, { error: err });
		}else if(!companies){
			return res.statusJson(404)
		}

		for(let i = 0; i < companies.length; i++){
	        if(companies[i].fakeId != i + 1){
	            var newID = i + 1;
	            break;
	        }
	    }

		let company = {
	    	companyName: body.companyName,
	    	companyDescription: body.companyDescription,
	    	industry: body.industry,
	    	img: (file)? file.path: '',
            fakeId: newID || companies.length + 1
		};
	    
		Company.create(company, (err, newCompany)=>{
			if(err){
				return res.statusJson(500, { error: err });
			}else if(!newCompany){
				return res.statusJson(404)
			}
			//console.log(company);
			return res.statusJson(200, { newCompany: newCompany });
		});

    });
}
const getCompany = ({ params }, res) =>{
	Company.findOne( { fakeId: params.companyid } , (err, company)=>{
		if(err){
			return res.statusJson(500, { error: err });
		}else if(!company){
			return res.statusJson(404)
		}
		//console.log(company);
		return res.statusJson(200, { company: company });
	});
}
const updateCompany = (req, res)=>{
	//console.log(req.body);
    if(!req.body.companyName
    		|| !req.body.companyDescription
    		|| !req.body.industry) {
    	return res.statusJson(400, { 
    		message: "Missing either the company name, company description, or industry" 
    	});
    }

	Company.findOne({ fakeId: req.params.companyid } ,(err, company)=>{
		//console.log(company);
		if(err) { res.send({ error: err }); }
		if(!company) { return res.statusJson(404, { message: "Company could not be found" }); }

		company.companyName = req.body.companyName;
		company.companyDescription = req.body.companyDescription;
		company.industry = req.body.industry;
		company.img = (req.file)? req.file.path: company.img;
		company.save((err, updatedCompany)=>{
			if(err){
				return res.statusJson(500, { error: err });
			}else if(!updatedCompany){
				return res.statusJson(404)
			}

			//console.log(updatedCompany);
			return res.statusJson( 200, { company: updatedCompany });
		});
	});
}
const deleteCompany = ({ params }, res)=>{
	Company.findOneAndDelete({ fakeId: params.companyid } ,(err, companyDeleted)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { companyDeleted: companyDeleted });
	});
}
const deleteCompanies = (req, res)=>{
	Company.deleteMany((err, info)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { data: 'Done' });
	});
}
const resetCompanies = (req, res)=>{
	Company.deleteMany((err, info)=>{
        if(err) { return res.json({ error: err }); }
        console.log(info)
        companyData.forEach((company)=>{
        	let fsdata = req.files[company.img][0];
        	company.img = fsdata.path;
        });
        
        Company.insertMany(companyData, (err, companies)=>{
        	if(err) { return res.json({ error: err }); }
			res.statusJson( 200, { companies: companies });
    	});
			//res.statusJson( 200, { data: 'Done'});
    });
}


module.exports= {
	getCompanies,
	createCompany,
	getCompany,
	updateCompany,
	deleteCompany,
	deleteCompanies,
	resetCompanies
}