const Model 	= require(__path_schemas + 'promo');

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        sort[params.sortField] = params.sortType;
        
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
    
    
        return Model
		.find(objWhere)
		.select('name status price amount duration used_times')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    getItems: (params = null, option = null) => {
        if(option.task == 'get-items-by-id'){
            return Model.findById(params.id);
        }
        if(option.task == 'get-name-items'){
            return Model.find({}, {_id: 1, name: 1});
        }
    },
    applyPromo: (name) => {
        return Model.findOneAndUpdate({name: name}, {$inc : {'used_times' : -1}});

    },
    listItemsFrontend: (params = null, option = null) => {
        let find = {};
        let select = 'name amount';
        let limit = 10;
        let sort = {};

        if(option.task == 'items-in-menu'){
            find = {status:'active'};
            sort = {ordering: 'asc'};
        }

        return Model.find(find).select(select).limit(limit).sort(sort);
    },
    updateAmountOfItem: (id, state) => {
        return Model.findOneAndUpdate({_id :id}, {$inc : {'amount' : state}}).exec();
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return Model.countDocuments(objWhere);
    },
    changeStatus: (id, currentStatus, user, option = null) => {
        let status = '';
        if(!Array.isArray(id)) status = (currentStatus === "active") ? "inactive" : "active";
        else status = currentStatus;
        let data = {
            status: status,
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        };
        if(option.tasks = 'change-multi'){
            return Model.updateMany({_id: {$in: id }}, data);
        } else if(option.tasks = 'change-one'){
            return Model.updateOne({_id: id}, data);
        }
    },
    changeOrdering: async (id, ordering, option = null) => {
        let data = {
            amount: parseInt(ordering),
        };
        if(Array.isArray(id)) {
            for(let index = 0; index < id.length; index ++){
                data.amount = parseInt(ordering[index]);
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
    saveItems: (item, user, option = null) => {
        if(option.tasks === 'add') {
            item.used_times = parseInt(item.amount);
            return new Model(item).save();
        }else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				amount: parseInt(item.amount),
                name: item.name,
                price:  parseInt(item.price),
				status: item.status,
				duration: item.duration,
			});
        }
    }
    
}