const MainModel 	= require(__path_schemas + 'products');
const FileHelpers = require(__path_helpers + 'file');
const uploadFolder  = __path_uploads + 'products/';
const fs = require('fs');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        if(params.groupID !== 'allvalue' && params.groupID !== '') objWhere['group.id'] = params.groupID;

        sort[params.sortField]  = params.sortType;

        return MainModel
            .find(objWhere)
            .select('name slug status ordering created modified group.name avatar special price')
            .sort(sort)
            .skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    },

    listItemsFrontend: (params = null, options = null) => {
        let find = {};
        let select = 'name created.user_name created.time group.id group.name avatar content price';
        let limit = 4;
        let sort = '';

        if (options.task == 'items-special'){
            find = {special: 'active'};
            sort = {ordering: 'asc'};
            limit = 4;
        }

        if (options.task == 'items-sales'){
            find = {special: 'active'};
            sort = {price: 'asc'};
            limit = 10;
        }

        if (options.task == 'items-news'){
            select = 'name created.user_name created.time group.name group.id  avatar content price';
            find = {status:'active'};
            sort = {'created.time': 'desc'};
            limit = 8;
        }

        if (options.task == 'items-in-category'){
            select = 'name created.user_name created.time group.name avatar content price';
            find = {status:'active', 'group.id': params.id};
            sort = {'created.time': 'desc'};
        }


        if (options.task == 'items-random'){
            return MainModel.aggregate([
                    { $match: { status: 'active' }},
                    { $project : {name : 1 , created : 1 ,avatar: 1, content: 1}  },
                    { $sample: {size: 4}}
                ]);
        }

        if (options.task == 'items-article-in-category'){
            find = {status:'active'};
            select = 'name created.user_name created.time group.name group.id avatar content price';
            sort = {'created.time': 'desc'};
            limit= 4; 
        }

        if (options.task == 'items-others'){
            select = 'name created.user_name created.time group.id group.name avatar content price';
            find = {status:'active', '_id': {$ne: params._id}, 'group.id': params.group.id};
            sort = {'created.time': 'desc'};
        }

        return MainModel.find(find).select(select).limit(limit).sort(sort);

    },

    getMainArticle: (id, option = null) => {
        let select = 'name created group.name group.id avatar content price';
        return MainModel.findById(id).select(select);
    },

    getItem: (id, options = null) => {
        return MainModel.findById(id);
    },

    getItemFrontend: (id, options = null) => {
        return MainModel.findById(id)
            .select('name avatar created content group.name group.id price');
    },

    countItem: (params, options = null) => {
        let objWhere    = {};

        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        return MainModel.count(objWhere);
    },

    changeStatus: (id, currentStatus, user, options = null) => {
        let status			= (currentStatus === "active") ? "inactive" : "active";
        let data 			= {
            status: status,
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        }

        if(options.task == "update-one"){
            return MainModel.updateOne({_id: id}, data);
        }

        if(options.task == "update-multi"){
            data.status = currentStatus;
            return MainModel.updateMany({_id: {$in: id }}, data);
        }
    },

    changeSpecial: (id, currentSpecial,user, options = null) => {
        let special			= (currentSpecial === "active") ? "inactive" : "active";
        let data 			= {
            special: special,
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        }

        if(options.task == "update-one"){
            return MainModel.updateOne({_id: id}, data);
        }

        if(options.task == "update-multi"){
            data.special = currentSpecial;
            return MainModel.updateMany({_id: {$in: id }}, data);
        }
    },


    changeOrdering: async (cids, orderings,user, options = null) => {
        let data = {
            ordering: parseInt(orderings),
            modified:{
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
                }
            };

        if(Array.isArray(cids)) {
            for(let index = 0; index < cids.length; index++) {
                data.ordering = parseInt(orderings[index]);
                await MainModel.updateOne({_id: cids[index]}, data)
            }
            return Promise.resolve("Success");
        }else{
            return MainModel.updateOne({_id: cids}, data);
        }
    },

    changePrice: async (cids, price, user, options = null) => {
        let data = {
            price: parseInt(price),
            modified:{
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
                }
            };

        if(Array.isArray(cids)) {
            for(let index = 0; index < cids.length; index++) {
                data.price = parseInt(price[index]);
                await MainModel.updateOne({_id: cids[index]}, data)
            }
            return Promise.resolve("Success");
        }else{
            return MainModel.updateOne({_id: cids}, data);
        }
    },

    deleteItem: async (id, options = null) => {
        if(options.task == "delete-one") {
            await MainModel.findById(id).then((item) => {
                FileHelpers.remove(uploadFolder, item.avatar);
            });
            return MainModel.deleteOne({_id: id});
        }

        if(options.task == "delete-mutli"){
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await MainModel.findById(id[index]).then((item) => {
                        FileHelpers.remove(uploadFolder, item.avatar);
                    });
                }
            }else{
                await MainModel.findById(id).then((item) => {
                    FileHelpers.remove(uploadFolder, item.avatar);
                });
            }
            return MainModel.deleteMany({_id: {$in: id } });
        }
    },

    saveItem: (item, user, options = null) => {
        if(options.task == "add") {
            item.created = {
				user_id: user.id,
                user_name: user.username,
				time: Date.now()
			}
            item.group = {
                id: item.group_id,
                name: item.group_name,
            }
			return new MainModel(item).save();
        }

        if(options.task == "edit") {
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
                price: parseInt(item.price),
				name: item.name,
                status: item.status,
                special: item.special,
				content: item.content,
                slug: item.slug,
                avatar: item.avatar,
                group: {
                    id: item.group_id,
                    name: item.group_name,
                },
				modified:{
                    user_id: user.id,
                    user_name: user.username,
					time: Date.now()
				}
			});
        }

        if(options.task == "change-group-name") {
            return MainModel.updateMany({'group.id': item.id}, {
				group: {
                    id: item.id,
					name: item.name,
				},
			});
        }
    }
}