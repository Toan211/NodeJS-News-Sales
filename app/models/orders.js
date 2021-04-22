const Model 	= require(__path_schemas + 'orders');
const StringHelpers   = require(__path_helpers + 'string');

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        sort[params.sortField] = params.sortType;
        
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
    
        return Model
		.find(objWhere)
		.select('code status shipping_fee user product time promo_code total')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    getItems: (params = null, option = null) => {
        if(option.task == 'get-items-by-id'){
            return Model.findById(params.id);
        }
        if(option.task == 'get-items-by-name'){
            return Model.find({name : params.name});
        }
        if(option.task == 'get-items-by-code-order'){
            return Model.find({code : params.code});
        }
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return Model.countDocuments(objWhere);
    },
    changeProgress: (id, currentStatus, option = null) => {
        return Model.updateOne({_id: id}, {status: currentStatus});
    },
    changeOrdering: async (id, ordering, user, option = null) => {
        let data = {
            ordering: parseInt(ordering),
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        };
        if(Array.isArray(id)) {
            for(let index = 0; index < id.length; index ++){
                data.ordering = parseInt(ordering[index]);
                await Model.updateOne({_id: id[index]}, data)
            }
            return Promise.resolve("Success");
        } else {
            return Model.updateOne({_id: id}, data);
        }
    },
    deleteItems: (id, option = null) => {
        if(option.tasks === 'delete-one') {
            return Model.deleteOne({_id: id});
        } else if(option.tasks === 'delete-multi') {
            return Model.remove({_id: {$in: id}});
        }
    },
    saveItems: (idOrder, product, user) => {
        let item = {};
        let total = 0;
        item.product = product;
        item.code = idOrder;
        item.shipping_fee = user.shipping_fee;
        item.time = Date.now();
        if(user.promo_code !== undefined || user.promo_code !== null) {
            item.promo_code = user.promo_code;
        } else {
            item.promo_code = '';
        }
        product.forEach( (item) => {
            total += item.price * item.quantity;
        });
        item.status = 'accepted';
        item.total = total;
        item.user = {
            first_name: user.first_name, 
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            address: user.address + ', ' + user.ward + ', ' + user.district + ', ' + user.province,
            message: user.message,
        };
        return new Model(item).save();
    }
    
}