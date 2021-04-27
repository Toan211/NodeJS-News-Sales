var express = require('express');
var router 	= express.Router();

const controllerName 	= 'promo';

const systemConfig  	= require(__path_configs + 'system');
const MainModel 	= require(__path_models + controllerName);
const MainValidate	= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const notify  		= require(__path_configs + 'notify');
const StringHelpers   = require(__path_helpers + 'string');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;

// List category
router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 = ParamsHelpers.createParam(req);
	let statusFilter = await UtilsHelpers.createFilterStatus(params, controllerName);

	await MainModel.countItems(params).then( (data) => {
		params.pagination.totalItems = data;
	});
	
	MainModel.listItems(params)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				params
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	
	MainModel.changeStatus(id, currentStatus, req.user, {tasks: 'change-one'}).then( (result) => {
		//NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-status-success'});
		res.json({'currentStatus': currentStatus, 'msg': notify.CHANGE_STATUS_SUCCESS, 'id': id});
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active');
	
	MainModel.changeStatus(req.body.cid, currentStatus, req.user, {tasks: 'change-multi'}).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {n: result.n, tasks: 'change-status-multi-success'});
	});
});

// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let amount 	= req.body.ordering;
	
	MainModel.changeOrdering(cids, amount).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {tasks: 'change-ordering-success'});
	});
});

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', '');
	MainModel.deleteItems(id, {tasks: 'delete-one'}).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {tasks: 'delete-success'});
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	MainModel.deleteItems(req.body.cid, {tasks: 'delete-multi'}).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {n: result.n, tasks: 'delete-multi-success'});
	});
});

// FORM
router.get(('/form(/:id)?'), (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let rdString = StringHelpers.generateCode(6);
	let item	= {name: rdString, price: 0, status: 'allValue', amount: 1, duration: ''};
	let errors   = null;
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors});
	}else { // EDIT
		MainModel.getItems({id: id}, {task: 'get-items-by-id'}).then( (item) =>{
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors});
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	MainValidate.validator(req);

	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? 'edit' : 'add';
	let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;

	if(errors) { 
		res.render(`${folderView}form`, { pageTitle, item, errors});
	} else {
		let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
		MainModel.saveItems(item, req.user, {tasks: taskCurrent}).then( (result) => {
			NotifyHelpers.show(req, res, linkIndex, {tasks: notifyTask});
		});
	}
});


// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

module.exports = router;
