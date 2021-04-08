const MainModel 	= require(__path_schemas + 'slider');
const FileHelpers = require(__path_helpers + 'file');
const uploadFolder  = __path_uploads + 'slider/';
const fs = require('fs');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        sort[params.sortField]  = params.sortType;

        return MainModel
            .find(objWhere)
            .select('name link status ordering created avatar')
            .sort(sort)
            .skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    },

    listItemsFrontend: (params = null, options = null) => {
        let find = {status:'active'};
        let select = 'link name created ordering avatar content';
        let limit;
        let sort = {ordering: 'asc'};


        return MainModel.find(find).select(select).limit(limit).sort(sort);

    },

    listItemsSearch: (params, options = null) =>{
        let objWhere    = {status:'active'};
        let sort		= {};
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        

        return MainModel
            .find(objWhere)
            .select('name slug avatar group.slug group.name content')
            .sort(sort);
            
    },

    

    getItem: (id, options = null) => {
        return MainModel.findById(id);
    },

    getItemFrontend: (id, options = null) => {
        return MainModel.findById(id)
            .select('name avatar created content group.slug group.name group.id');
    },

    getSlugArticle: (slug, option = null) => {
        let select = 'name created.user_name created.time group.slug group.name group.id avatar content';
        return MainModel.find({slug: slug}).select(select);
    },

    countItem: (params, options = null) => {
        let objWhere    = {};

        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        return MainModel.count(objWhere);
    },

    changeStatus: (id, currentStatus, options = null) => {
        let status			= (currentStatus === "active") ? "inactive" : "active";
        let data 			= {
            status: status,
        }

        if(options.task == "update-one"){
            return MainModel.updateOne({_id: id}, data);
        }

        if(options.task == "update-multi"){
            data.status = currentStatus;
            return MainModel.updateMany({_id: {$in: id }}, data);
        }
    },

    changeOrdering: async (cids, orderings, options = null) => {
        let data = {
            ordering: parseInt(orderings),
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

    saveItem: (item, options = null) => {
        if(options.task == "add") {
            item.created = {
				time: Date.now()
			}
			return new MainModel(item).save();
        }

        if(options.task == "edit") {
            return MainModel.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                status: item.status,
				content: item.content,
                link: item.link,
                avatar: item.avatar,
			});
        }

    }  
}