const Resource = require('../models/resource');
const User = require('../models/user');

module.exports.indexRes = async(req, res) => {
    const resources = await Resource.find({});
    res.render('resources/index', { resources });
}

module.exports.renderNewRes = async(req, res) => {
    res.render('resources/new');
}

module.exports.renderEditRes = async(req, res) => {
    const resource = await Resource.findById(req.params.resId);

    if(!resource){
        req.flash('error', 'Cannot find that module!');
        return res.redirect('/modules');
    }

    res.render('resources/edit', { resource });
}

module.exports.createRes = async(req, res) => {
    const resource = new Resource(req.body.resource);
    await resource.save();
    req.flash('success', 'Successfully made a new resource!');
    res.redirect('/resources');
}

module.exports.updateRes = async(req, res) => {
    await Resource.findByIdAndUpdate(req.params.resId, { ... req.body.resource });
    req.flash('success', 'Successfully updated module!');
    res.redirect('/resources');
}