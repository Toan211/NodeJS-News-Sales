const MainModel 	= require(__path_models + 'products');

module.exports = async(req, res, next) => {
    
    await MainModel
        .listItemsFrontend(null, {task: 'items-random'} )
        .then( (items) => { res.locals.itemsRandom = items; });
    next();
}