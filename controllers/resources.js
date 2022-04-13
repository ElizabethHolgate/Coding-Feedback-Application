const Resource = require('../models/resource');
const User = require('../models/user');

module.exports.indexRes = async(req, res) => {
    const resources = await Resource.find({});
    res.render('resources/index', { resources });
}

module.exports.renderNewRes = async(req, res) => {
    res.render('resources/new');
}

module.exports.createRes = async(req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();
    req.flash('success', 'Successfully made a new resource!');
    res.redirect('/resources');
}