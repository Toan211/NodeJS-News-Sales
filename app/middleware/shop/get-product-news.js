const ProductModel 	= require(__path_models + 'products');

module.exports = async(req, res, next) => {
    
    await ProductModel
        .listItemsFrontend(null, {task: 'items-news'} )
        .then( (items) => { res.locals.itemsNews = items; });
    next();
}