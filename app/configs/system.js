
module.exports = {
    prefixAdmin: 'adminCCC',
    prefixBlog: '',
    prefixSales: 'sales',
    format_long_time: 'DD-MM-YYYY hh:mm:ss',
    format_date: 'DD-MM-YYYY',
    env: 'dev', // production dev
    status_value: [
        {id: 'allvalue', name: 'Choose Status'},
		{id: 'active', name: 'Active'},
		{id: 'inactive', name: 'InActive'},
    ],
    special_value: [
        {id: 'allvalue', name: 'Choose Special'},
		{id: 'active', name: 'Active'},
		{id: 'inactive', name: 'InActive'},
    ],
    groupacp_value: [
        {id: 'allvalue', name: 'Choose Group ACP'},
		{id: 'yes', name: 'Yes'},
		{id: 'no', name: 'No'},
    ],
    radio_object: [
		{value: 'yes', name: 'Yes'},
		{value: 'no', name: 'No'}
	],
    orders_state_value: [ // chờ xác nhận, chờ lấy hàng, đang giao, đã giao, đã hủy
        {id: 'accepted', name: 'Accepted'},
        {id: 'in-progress', name: 'In progress'},
        {id: 'shipped', name: 'Shipped'},
        {id: 'delivered', name: 'Delivered'},
        {id: 'completed', name: 'Completed'},
	],
};