const MiddleModel 	= require(__path_models + 'slider');

module.exports = async(req, res, next) => {
    
    await MiddleModel
            .listItemsFrontend(null,{task: null})
            .then( (items) => { res.locals.itemsSlider = items; });
    next();
}