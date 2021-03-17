$(document).ready(function () {

    let linkBox = $(".box-large").data("url");
    let linkGold = $("#box-gold").data("url");
    let linkCoin = $("#box-coin").data("url");

    $(".box-large").load(linkBox, null, function(res, status){
        let data = JSON.parse(res);
        console.log(res);
        $(".box-large").html(renderBox(data));
    });

    $("#box-gold").load(linkGold, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-gold").html(renderGoldTable(data));
    });
    
    $("#box-coin").load(linkCoin, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-coin").html(renderCoinTable(data));
    });

});

//load data from json
function loadData(id, url){
    $("#data-" + id).load(url,null, function(res, status){
        let data = JSON.parse(res);
        $("#data-" + id).html(rederNewsCategoryBox(data));
    }) 
}

function rederNewsCategoryBox(items) {
    let xhtml = '';
    items.forEach(
        (item) => 
        xhtml += 
        `
            <div class="col-lg-6 col-md-6">
                <div class="single-what-news mb-100">
                    <div class="what-img">
                        <img src="uploads/article/${item.thumb}" alt="" class="img_itemsRandom_home">
                    </div>
                    <div class="what-cap">
                        <span class="color1">${item.category.name}</span>
                        <h4><a href="/article/${item._id}">${item.name}</a></h4>
                    </div>
                </div>
            </div>
        `
    );
    
    return xhtml;
}

function renderBox(items){
    let xhtml = '';

    items.forEach(
        (item) =>
    xhtml += 
    `
    <ul class="fashion_catgnav">
              <li>
                <div class="catgimg2_container"> <a href="pages/single.html"><img alt="" src="images/390x240x1.jpg"></a> </div>
                <h2 class="catg_titile"><a href="pages/single.html">${item.name }</a></h2>
                <div class="comments_box"> <span class="meta_date">${item.group.name }</span> <span class="meta_comment"><a href="#">No Comments</a></span> <span class="meta_more"><a  href="#">Read More...</a></span> </div>
                <p>Nunc tincidunt, elit non cursus euismod, lacus augue ornare metus, egestas imperdiet nulla...</p>
              </li>
            </ul>
    `
    );
    return xhtml;
}

function renderGoldTable(items) {
    let xhtml = '';
    items.forEach(
        (item) => {
            let currentItem = Object.values(item);
            xhtml += `<tr>
                <td>${currentItem[0].type}</td>
                <td>${currentItem[0].buy}</td>
                <td>${currentItem[0].sell}</td>
            </tr>`;
    });
    
    return `<table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th><b>Loại vàng</b></th>
                    <th><b>Mua vào</b></th>
                    <th><b>Bán ra</b></th>
                </tr>
            </thead>
            <tbody>
                ${xhtml}
            </tbody>
        </table>`;
}

function renderCoinTable(items) {
    let xhtml = '';
    items.forEach(
        (item) => {
            console.log(item);
            let price = Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.quote.USD.price);
            let textColor = item.quote.USD.percent_change_24h > 0 ? 'text-success' : 'text-danger';
            let percentChange = Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(item.quote.USD.percent_change_24h) + "%";
            xhtml += `<tr>
                <td>${item.name}</td>
                <td>${price}</td>
                <td><span class="${textColor}">${percentChange}</span></td>
            </tr>`;
    });
    
    return `<table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th><b>Name</b></th>
                    <th><b>Price (USD)</b></th>
                    <th><b>Change (24h)</b></th>
                </tr>
            </thead>
            <tbody>
                ${xhtml}
            </tbody>
        </table>`;
}