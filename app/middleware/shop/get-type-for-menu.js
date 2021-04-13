const MainModel 	= require(__path_models + 'types');

module.exports = async(req, res, next) => {
    
    await MainModel
            .listItemsFrontend(null, {task: 'items-in-menu'} )
            .then( (items) => { res.locals.itemsCategory = items; });
    next();
}