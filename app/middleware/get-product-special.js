const ProductModel 	= require(__path_models + 'products');

module.exports = async(req, res, next) => {
    
    await ProductModel
        .listItemsFrontend(null, {task: 'items-special'} )
        .then( (items) => { res.locals.itemsSpecial = items; });
    next();
}