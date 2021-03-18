$(document).ready(function () {

    let linkBox = $(".box-large").data("url");
    let linkGold = $("#box-gold").data("url");
    let linkCoin = $("#box-coin").data("url");
    let linkCate0 = $("#box-cate0").data("url");
    let linkCate1 = $("#box-cate1").data("url");
    let linkCate2 = $("#box-cate2").data("url");
    let linkCate3 = $("#box-cate3").data("url");
    let linkCate4 = $("#box-cate4").data("url");

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

    $("#box-cate0").load(linkCate0, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-cate0").html(renderBox(data));
    });

    $("#box-cate1").load(linkCate1, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-cate1").html(renderBox(data));
    });
    $("#box-cate2").load(linkCate2, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-cate2").html(renderBox(data));
    });
    $("#box-cate3").load(linkCate3, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-cate3").html(renderBox(data));
    });
    $("#box-cate4").load(linkCate4, null, function(response, status) {
        let data = JSON.parse(response);
        $("#box-cate4").html(renderBox(data));
    });


});

formatSummary = (content, maxLength = 300) => { 
    return content.replace(/(<([^>]+)>)/igm,"").substr(0, maxLength);
}

formatDate = (time) => { 
    return moment(time).format(systemConfig.format_time);
} 

//load data from json
function loadData(id, url){
    $("#data-" + id).load(url,null, function(res, status){
        let data = JSON.parse(res);
        $("#data-" + id).html(renderBox(data));
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
    let righthtml = '';

    for (let i = 1; i < items.length; i++) {
        righthtml+=`
        <li>
            <div class="media wow fadeInDown"> <a class="media-left"  href="/article/${items[i]._id}">
                <img src="uploads/articles/${items[i].avatar}" alt="${items[i].name}"></a>
                <div class="media-body">
                <h4 class="media-heading"><a href="/article/${items[i]._id}">${items[i].name} </a></h4>
                <div class="comments_box">
                <span class="meta_date">${formatSummary(items[0].created.time)}</span>
                    <span class="meta_more"><a  href="/category/${items[0].group.id}">${items[i].group.name}</a></span>
                    </div>
                </div>
            </div>
      </li>

        `
        
    }
    
    xhtml = 
    `
        <div class="business_category_left wow fadeInDown">

            <ul class="fashion_catgnav">
              <li>
                <div class="catgimg2_container"> <a href="/article/${items[0]._id}"><img src="uploads/articles/${items[0].avatar}" alt="${items[0].name}"></a> </div>
                <h2 class="catg_titile"><a href="/article/${items[0]._id}">${items[0].name}</a></h2>
                <div class="comments_box">
                  <span class="meta_date">${formatSummary(items[0].created.time)}</span> 
                  <span class="meta_more"><a  href="/category/${items[0].group.id}">${items[0].group.name}</a></span> </div>
                <p>${formatSummary(items[0].content)}...</p>
              </li>
            </ul>
          </div> 

          <div class="business_category_right wow fadeInDown">
          <ul class="small_catg">
            ${righthtml}

          </ul>
        </div>
          
    `
    
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