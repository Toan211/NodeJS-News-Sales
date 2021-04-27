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

    getItem: (id, options = null) => {
        return Model.findById(id);
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
    saveItems: (idOrder, product, user, sale_off) => {
        let item = {};
        let total = 0;
        item.product = product;
        item.code = idOrder;
        item.shipping_fee = user.shipping_fee;
        item.time = Date.now();

        product.forEach( (item) => {
            total += item.price * item.quantity;
        });
        if(Object.keys(sale_off).length !== 0) {
            item.promo_code = {
                name: sale_off.code,
                value: sale_off.saleOff
            }
            item.total = total + parseInt(user.shipping_fee) - parseInt(sale_off.saleOff);
        } else {
            item.promo_code = {
                name: "0",
                value: 0
            }
            item.total = total + parseInt(user.shipping_fee);
        }
        
        item.status = 'accepted';      
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