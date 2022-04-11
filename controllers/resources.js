const Resource = require('../models/resource');
const User = require('../models/user');

module.exports.indexRes = async(req, res) => {
    const resources = await Resource.find({});
    res.render('resources/index', { resources });
}