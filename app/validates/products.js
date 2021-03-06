const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 80  },
    slug: { min: 5, max: 80 },
    ordering: { min: 0, max: 1000 },
    status: { value: 'allvalue' },
    special: { value: 'allvalue' },
    content: { min: 5, max: 1000000 },
    group: { value: 'allvalue' },
    brand: { value: 'allvalue' },
    color: { min: 1},
    price: { min: 1000 },
    quantity: { min: 0 },
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

            req.checkBody('slug', util.format(notify.ERROR_SLUG, options.slug.min, options.slug.max) )
            .isLength({ min: options.slug.min, max: options.slug.max });
            
        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // PRICE
        req.checkBody('price', util.format(notify.ERROR_ORDERING, options.price.min))
            .isInt({gt: options.price.min});

            // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // SPECIAL
        req.checkBody('special', notify.ERROR_SPECIAL)
            .isNotEqual(options.special.value);

            // CONTENT
        req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max) )
            .isLength({ min: options.content.min, max: options.content.max });

             // GROUP
        req.checkBody('group_id', notify.ERROR_GROUP)
        .isNotEqual(options.group.value);

        // GROUP
        req.checkBody('brand_id', notify.ERROR_GROUP)
        .isNotEqual(options.brand.value);

        // COLOR
        req.checkBody('color', util.format(notify.ERROR_COLOR, options.color.min))
            .isLength({ min: options.color.min});

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];

        if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'avatar', msg: errUpload});
		}else {
			if(req.files == undefined && taskCurrent == "add"){
				errors.push({param: 'avatar', msg: notify.ERROR_FILE_REQUIRE});
			}
        }

        return errors;
    }
}