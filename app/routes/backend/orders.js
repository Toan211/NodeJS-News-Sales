var express = require('express');
var router 	= express.Router();

const controllerName 	= 'orders';

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const notify  			= require(__path_configs + 'notify');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;

// List items
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
router.post('/change-progress/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'confirming'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	
	MainModel.changeProgress(id, currentStatus).then( (result) => {
		// NotifyHelpers.show(req, res, linkIndex, {tasks: 'change-status-success'}); 
		res.json({'currentStatus': currentStatus, 'msg': notify.CHANGE_STATUS_SUCCESS, 'id': id});
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active');
	
	MainModel.changeStatus(req.body.cid, currentStatus, req.user, {tasks: 'change-multi'}).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, { tasks: 'change-status-multi', total: result.n});
	});
});

// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	
	MainModel.changeOrdering(cids, orderings,  req.user).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {tasks: 'change-ordering'});
	});
});

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', '');
	MainModel.deleteItems(id, {tasks: 'delete-one'}).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {tasks: 'delete'});
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	MainModel.deleteItems(req.body.cid, {tasks: 'delete-multi'}).then( (result) => {
		NotifyHelpers.show(req, res, linkIndex, {tasks: 'delete-multi', total: result.n ,});
	});
});

// FORM
router.get(('/form(/:id)?'), (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let errors   = null;
	MainModel.getItem(id).then((item) =>{
		res.render(`${folderView}form`, { pageTitle: 'Invoice #' + item.code, item, errors});
	});	
});

// SAVE = ADD EDIT
router.post('/save', async (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	//MainValidate.validator(req);

	let item = Object.assign(req.body);
	//let errors = req.validationErrors();
	await MainModel.getItems({name: item.name}, {task: 'get-items-by-name'}).then( (item) =>{
		if(item.length > 0) {
			errors.unshift({param: 'name', msg: 'Đã tồn tại'});
		}
	});
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? 'edit' : 'add';
	let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;

	if(errors) { 
		res.render(`${folderView}form`, { pageTitle, item, errors});
	} else {
		let notifyTask = (taskCurrent === 'add') ? 'add' : 'edit';
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
