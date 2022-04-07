const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/EpressError');
const Module = require('../models/module');
const { moduleValidation } = require('../validationSchemas');
const { isLoggedIn } = require('../middleware');

const validateModule = (req, res, next) => {
    const { error } = moduleValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', isLoggedIn, (req, res) => {
    res.render('modules/new');
});

router.post('/', isLoggedIn, validateModule, catchAsync(async (req, res) => {
    const module = new Module(req.body.module);
    await module.save();
    req.flash('success', 'Successfully made a new module!');
    res.redirect(`/modules/${module._id}`)
}));

router.get('/', catchAsync(async(req, res) => {
    const modules = await Module.find({});
    res.render('modules/index', { modules });
}));

router.get('/:id', catchAsync(async(req, res) => {
    const module = await Module.findById(req.params.id).populate('tasks');
    if(!module){
        req.flash('error', 'Cannot find that module!');
        return res.redirect('/modules');
    }
    res.render('modules/show', { module });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const module = await Module.findById(req.params.id)
    if(!module){
        req.flash('error', 'Cannot find that module!');
        return res.redirect('/modules');
    }
    res.render('modules/edit', { module });
}));

router.put('/:id', validateModule, catchAsync(async (req, res) => {
    const { id } = req.params;
    const module = await Module.findByIdAndUpdate(id, { ...req.body.module });
    req.flash('success', 'Successfully updated module!');
    res.redirect(`/modules/${module._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted module!');
    res.redirect('/modules');
}));

module.exports = router;