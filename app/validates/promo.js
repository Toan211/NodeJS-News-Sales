const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 2, max: 30 },
    price: { min: 0},
    status: { value: 'allValue' },
    amount: { min: 0},
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

        // PRICE
        req.checkBody('price', util.format(notify.ERROR_PRICE, options.price.min))
            .isInt({gt: options.price.min});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // AMOUNT
        req.checkBody('amount', util.format(notify.ERROR_QUANTITY, options.amount.min))
            .isInt({gt: options.amount.min});
    }
}