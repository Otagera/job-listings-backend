const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const Company = mongoose.model('Company');
const listingData = require('../models/listing-data');

const setHowOld = (listing)=>{
	let t = new Date(listing.dateCreated);
	let tt = t.getTime();
	let ttt = Math.floor((Date.now() - tt) / 86400000 );
	let tttt = 0;
	if(ttt === 0){
		tttt = 'New!';
		listing.isThereNew = true;
		console.log('1');
	} else if(ttt < 7){
		listing.isThereNew = true;
		console.log('2');
		tttt = ttt + 'd';
	} else if(ttt >= 7 && ttt < 28){
		tttt = Math.floor(ttt / 7) + 'w';
	} else if(ttt >= 28 && ttt < 365){
		tttt = Math.floor(ttt / 30) + 'mon';
	}
	listing.howOld = tttt;
}

const getListings = (req, res) =>{
	Listing.find().sort({ dateCreated: 'desc' }).populate('company').exec((err, listings)=>{
		if(err) { res.send({ error: err }); }

		listings.forEach((listing)=>{
			setHowOld(listing);
			//console.log(listing);
		});
		res.statusJson( 200, { listings: listings });
	});
}
const getListingsByCompany = (req, res) =>{
	Listing.find({})
		   .populate({
		   		path: 'company',
		   		match: { fakeId: req.params.companyid }
		    })
		   .exec((err, listings)=>{
				if(err) { res.send({ error: err }); }

				listings.forEach((listing)=>{
					setHowOld(listing);
				});

				res.statusJson( 200, { listings: listings });
			});
}
const createListing = ({ body, file }, res)=>{
	//console.log(body);
    if(!body.jobTitle || !body.typeOfEmployment || !body.location || !body.role || !body.level) {
    	return res.statusJson(400, { 
    		message: "Missing either , job tile, type of employment, location, role, or location" 
    	});
    }
    Listing.find({}, null, { sort: {howOld: 1}}, (err, listings)=>{
		if(err){
			return res.statusJson(500, { error: err });
		}else if(!listings){
			return res.statusJson(404)
		}

		for(let i = 0; i < listings.length; i++){
	        if(listings[i].fakeId != i + 1){
	            var newID = i + 1;
	            break;
	        }
	    }
		let listing = {
	    	//companyName: body.companyName,
	    	isThereNew: true,
	    	isFeatured: true,
	    	jobTitle: body.jobTitle,
	    	typeOfEmployment: body.typeOfEmployment,
	    	location: body.location,
	    	role: body.role,
	    	level: body.level,
			jobSummary:	body.jobSummary,
			lengthOfExp: body.lengthOfExp,
	    	languages: (body.languages)? body.languages : [],
	    	tools: (body.tools)? body.tools : [],
	    	//img: (file)? file.path: '',
	    	salary: Number.parseInt(body.salary, 10),
            fakeId: newID || listings.length + 1
		};
		setHowOld(listing);

	    Company.findOne({ fakeId: body.companyFakeId }, (err, company) => {
			if(err){
				return res.statusJson(500, { error: err });
			}else if(!company){
				return res.statusJson(404)
			}
			listing.company = company;	    
			Listing.create(listing, (err, newListing)=>{
				if(err){
					return res.statusJson(500, { error: err });
				}else if(!newListing){
					return res.statusJson(404)
				}
				//console.log(listing);
				return res.statusJson(200, { newListing: newListing });
			});
	    	
	    });

    });
}
const getListing = ({ params }, res) =>{
	Listing.findOne().populate('company').exec( { fakeId: params.listingid } , (err, listing)=>{
		if(err){
			return res.statusJson(500, { error: err });
		}else if(!listing){
			return res.statusJson(404)
		}
		//console.log(listing);
		return res.statusJson(200, { listing: listing });
	});
}
const updateListing = (req, res)=>{
	//console.log(req.body);
    if(!req.body.companyName || !req.body.jobTitle || !req.body.typeOfEmployment || !req.body.location || !req.body.role || !req.body.level) {
    	return res.statusJson(400, { 
    		message: "Missing either the company name, job tile, how old, type of employment, location, role, or location" 
    	});
    }

	Listing.findOne({ fakeId: req.params.listingid } ,(err, listing)=>{
		//console.log(listing);
		if(err) { res.send({ error: err }); }
		if(!listing) { return res.statusJson(404, { message: "Listing could not be found" }); }

		listing.isThereNew = (req.body.isThereNew === 'true')? true: false;
		listing.isFeatured = (req.body.isFeatured === 'true')? true: false;
		listing.jobTitle = req.body.jobTitle;
		listing.typeOfEmployment = req.body.typeOfEmployment;
		listing.location = req.body.location;
		listing.role = req.body.role;
		listing.level = req.body.level;
		listing.jobSummary = req.body.jobSummary;
		listing.lengthOfExp = req.body.lengthOfExp;
		listing.languages = (req.body.languages)? req.body.languages : listing.languages;
		listing.tools = (req.body.tools)? req.body.tools : listing.tools;
		listing.save((err, updatedListing)=>{
			if(err){
				return res.statusJson(500, { error: err });
			}else if(!updatedListing){
				return res.statusJson(404)
			}

			//console.log(updatedListing);
			return res.statusJson( 200, { listing: updatedListing });
		});
	});
}
const deleteListing = ({ params }, res)=>{
	Listing.findOneAndDelete({ fakeId: params.listingid } ,(err, listingDeleted)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { listingDeleted: listingDeleted });
	});
}
const deleteListings = (req, res)=>{
	Listing.deleteMany((err, info)=>{
		if(err) { res.send({ error: err }); }
		res.statusJson( 200, { data: 'Done' });
	});
}
const resetListings = (req, res)=>{
	Listing.deleteMany((err, info)=>{
        if(err) { return res.json({ error: err }); }

        let promises = [];
        listingData.forEach(listing=>{
        	setHowOld(listing);
        	promises.push(
        		new Promise((resolve, reject)=>{
		        	Company.findOne({ fakeId: listing.companyFakeId }, (err, company) => {
						if(err){
							reject('Error');
							return res.statusJson(500, { error: err });
						}else if(!company){
							return res.statusJson(404)
						}
						resolve('Success');
						listing.company = company;
						//listing.howOld = new Date(listing.howOld);
				    });        		
        		})
        	);
        });
        
        Promise.all(promises).then(()=>{
	        Listing.insertMany(listingData, (err, listings)=>{
	        	if(err) { return res.json({ error: err }); }
				res.statusJson( 200, { listings: listings });
	    	});        	
        });
    });
}


module.exports= {
	getListings,
	getListingsByCompany,
	createListing,
	getListing,
	updateListing,
	deleteListing,
	deleteListings,
	resetListings
}