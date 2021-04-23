const MainModel 	= require(__path_models + 'brands');

module.exports = async(req, res, next) => {
    
    await MainModel
            .listItemsFrontend(null, {task: 'items-in-menu'} )
            .then( (items) => { res.locals.itemsBrand = items; });
    next();
}