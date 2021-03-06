$(document).ready(function () {

    // choose location
    var localpicker = new LocalPicker({
		province: "ls_province",
		district: "ls_district",
		ward: "ls_ward",
        provinceText: 'Choose province / city',
        districtText: 'Choose district',
        wardText: 'Choose ward',
    });
    $('select[name=ls_province]').change(function() {
        let province = $(this).find('option:selected').text();
        let fee = 0;
        let totalBox = $('#total-price');
        $('input[name=province]').val(province);
        $.ajax({
            url: 'sales/checkout/get-shipping-fee',
            type: 'get',
            success:function(data){
                data.forEach( (item) => {
                    if(item.name === province) {
                        fee = item.value;
                        $('#shipping-fee').html(fee + 'đ');
                        totalBox.html('$ ' + (Number(totalBox.text().slice(2)) + Number(fee)));
                        $('input[name=shipping_fee]').val(fee);
                    }
                });
            }
        });
    });
    $('select[name=ls_district]').change(function() {
        $('input[name=district]').val($(this).find('option:selected').text());
    });
    $('select[name=ls_ward]').change(function() {
        $('input[name=ward]').val($(this).find('option:selected').text());
    });




    //add product to cart
    $("#cart_form").submit(function(event ) {
        var quantity = $('#quantity_input').val();
        // var size = $('#size_select option:selected').val();
        $(document).trigger("clear-alert-id.notify_cart");
        if (Number(quantity) < 1 ) {
            $(document).trigger("set-alert-id-notify_cart", [
                {
                    "message": "Please choose amount right !!!",
                    "priority": "info"
                }
            ]);
            console.error("hell");
            event.preventDefault();
        } else {
            event.preventDefault();
            $.ajax({
                url: 'sales/cart/add-to-cart',
                type: 'post',
                data:$('form').serialize(),
                success:function(data){
                    $('.ps-cart__toggle').append(`<span style="width: 20px;" ><i>${data.length}</i></span>`);
                    console.log(data);
                    let total = 0;
                    let numberItems = 0;
                    let xhtml = `<ul class="dropdown-menu">`;

                    data.forEach( (item) => {
                        xhtml += `<li>
                        <div class="ps-cart-item"><a class="ps-cart-item__close" href="sales/cart/delete/${item.id}"></a>
                        <div class="media-left">
                          <div class="cart-img"> <a href="product/${item.slug}"> <img class="media-object img-responsive" src="uploads/products/${item.avatar}" alt="..."> </a> </div>
                        </div>
                        <div class="media-body">
                          <h6 class="media-heading" style="
                          font-size: 14px;
                          padding-right: 33px;">${item.name}</h6>
                          <span class="price">${item.price} đ </span> <span class="qty">QTY: ${item.quantity}</span> </div>
                      </li>`;
                        total += Number(item.quantity) * Number(item.price);
                        numberItems += Number(item.quantity);
                    });
                    xhtml += `
                    <li>
                        <h5 class="text-center">Số lượng: ${numberItems} <br> 
                        Tổng tiền: ${total}đ</h5>
                        
                    </li>
                    <li class="margin-0">
                        <div class="row">
                        <div class="col-xs-6"> <a href="sales/cart" class="btn">VIEW CART</a></div>
                        
                        <div class="col-xs-6 "> <a href="sales/checkout" class="btn">CHECK OUT</a></div>
                        </div>
                    </li>
                  </ul>`;

                    $('.user-basket').append(xhtml);
                    Swal.fire({
                        title: 'Add to cart success!',
                        icon: 'success',
                    });
                }
            });
        }
    });
    // show product in cart in header (get from cookie)
    if (typeof $.cookie('cart') !== 'undefined'){
        let data = JSON.parse($.cookie('cart').slice(2));
        $('.ps-cart__toggle').append(`<span style="width: 20px;" ><i>${data.length}</i></span>`);
                    
                    let total = 0;
                    let numberItems = 0;
                    let xhtml = `<ul class="dropdown-menu">`;

                    data.forEach( (item) => {
                        xhtml += `<li>
                        <div class="ps-cart-item"><a class="ps-cart-item__close" href="sales/cart/delete/${item.id}"></a>
                        <div class="media-left">
                          <div class="cart-img"> <a href="product/${item.slug}"> <img class="media-object img-responsive" src="uploads/products/${item.avatar}" alt="..."> </a> </div>
                        </div>
                        <div class="media-body">
                          <h6 class="media-heading" style="
                          font-size: 14px;
                          padding-right: 33px;">${item.name}</h6>
                          <span class="price">${item.price} đ </span> <span class="qty">QTY: ${item.quantity}</span> </div>
                      </li>`;
                        total += Number(item.quantity) * Number(item.price);
                        numberItems += Number(item.quantity);
                    });
                    xhtml += `
                    <li>
                        <h5 class="text-center">Số lượng: ${numberItems} <br> 
                        Tổng tiền: ${total}đ</h5>
                        
                    </li>
                    <li class="margin-0">
                        <div class="row">
                        <div class="col-xs-6"> <a href="sales/cart" class="btn">VIEW CART</a></div>
                        
                        <div class="col-xs-6 "> <a href="sales/checkout" class="btn">CHECK OUT</a></div>
                        </div>
                    </li>
                  </ul>`;

        $('.user-basket').append(xhtml);
    }

})

function filterPrice() {
    var el = $('.ac-slider');
    if (el.length > 0) {
        var values = el.slider("option", "values");
        var linkRedirect = 'category/filter-category/' + values[0] + '-' + values[1];
        console.log(values[0],'-', values[1]);

        window.location.pathname = linkRedirect;
    }
    else {
        return false;
    }
}