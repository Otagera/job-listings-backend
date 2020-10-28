
let getIndex = (req, res)=> {
  req.statusJson(200, { title: 'Index' });
}

module.exports = {
	getIndex
};