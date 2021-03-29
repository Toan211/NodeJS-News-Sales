//CKEDITOR.replace('content');
//CKEDITOR.replace( 'content' );

//Create slug input
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ *? /g,"-");
    str = str.trim(); 
    return str;
}

function changeStatus(link)
{
    $.get( link, function( data ) {
        console.log(data);
        var notifyClick = $("a.status-" + data.id)
        
        var btnNow = 'btn-warning';
        var btnAfter = 'btn-success';
        var statusValue = 'active';
        if(data.currentStatus == 'active') {
            btnNow = 'btn-success';
            btnAfter = 'btn-warning';
            statusValue = 'inactive';
        }
        //change link cho nút
        var linkChange = notifyClick.attr("onclick").replace(data.currentStatus, statusValue);
        notifyClick.attr("onclick", linkChange);
        // thông báo ajax
        notifyClick.notify(data.msg, { position:"top", className: 'success', });
        // add vs remove class trực tiếp
        notifyClick.addClass(btnAfter).removeClass(btnNow);
    });

}

//preview upload img
function readURL(input, output) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $(output).attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); 
    }
  }
  
$(document).ready(function () { //deprecated 
//$(function () {
    var ckbAll = $(".cbAll");
    var fmAdmin = $("#zt-form");

    // CKEDITOR
    if ($('textarea#content').length) {
        CKEDITOR.replace('content');
    } // cái này vô dc
    
      $("#imgInp").on('change',function() {
        readURL(this);
      });

    //call active menu
    activeMenu();

    //check selectbox
    change_form_action("#zt-form .slbAction", "#zt-form","#btn-action");

    //check all
    ckbAll.click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
        if ($(this).is(':checked')) {
            $(".ordering").attr("name", "ordering");
        }else{
           
            $(".ordering").removeAttr("name");
        }
        
    });
    // hiden notify
    hiddenNotify(".close-btn");



    $("input[name=cid]").click(function () {
        if ($(this).is(':checked')) {
            $(this).parents("tr").find('.ordering').attr("name", "ordering");
        }else{
            $(this).parents("tr").find('.ordering').removeAttr("name");
        }
    });
    
    // CONFIRM DELETE
    $('a.btn-delete').on('click', () => {
        if (!confirm("Are you sure you want to delete this item?")) return false;
    });

    //active menu function
    function activeMenu() {
        let pathname = window.location.pathname;
        let arrMenu = pathname.split("/");
        let currentMenu = arrMenu[2];
        $('li.nav-item a[data-active="'+currentMenu+'"]').addClass('my-active');
        $('li.nav-item a[data-active="'+currentMenu+'"]').parent().parent().parent().addClass('menu-open');
    }

    //
    // ("#zt-form .slbAction", "#zt-form","#btn-action"
    function change_form_action(slb_selector, form_selector, id_btn_action) {

        var optValue;
        var isDelete = false;
        var pattenCheckDelete = new RegExp("delete", "i");

        $(slb_selector).on("change", function () {
            
            
            optValue = $(this).val();
            
            
            if(optValue !== "") {
                $(id_btn_action).removeAttr('disabled');
            } else {
                $(id_btn_action).attr('disabled', 'disabled');
            }
            $(form_selector).attr("action", optValue);
        });

        $(form_selector + " .btnAction").on("click", function () {
            
            isDelete = pattenCheckDelete.test($(slb_selector).val());
            if(isDelete){
                var confirmDelete = confirm('Are you really want to delete?');
                if(confirmDelete === false){
                    return;
                }
            }

            var numberOfChecked = $(form_selector + ' input[name="cid"]:checked').length;
            if (numberOfChecked == 0) {
                alert("Please choose some items");
                return;
            } else {
                var flag = false;
                var str = $(slb_selector + " option:selected").attr('data-comfirm');
               
                if (str != undefined) {

                    //Kiểm tra giá trị trả về khi user nhấn nút trên popup
                    flag = confirm(str);
                    if (flag == false) {
                        return flag;
                    } else {
                        $(form_selector).submit();
                    }

                } else {
                    if (optValue != undefined) {
                        $(form_selector).submit();
                    }
                }
            }

        });
    }

    // hidden parent (hidden message notify)
    function hiddenNotify(close_btn_selector){
        $(close_btn_selector).on('click', function(){
            $(this).parent().css({'display':'none'});
        })    
    }

    $('select[name="group_id"]').change(function(){
        $('input[name="group_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
    });

    $('select[name="filter_group"]').change(function(){
        var path = window.location.pathname.split('/');
        var linkRedirect = '/' + path[1] + '/' +  path[2] + '/filter-group/' + $(this).val();
         window.location.pathname = linkRedirect;
    });

    //slug
    $('input#name_slug').keyup(function(){
        $('input[name="slug"]').val(change_alias($(this).val()));
     });

    // fill avatar_name when choose group
    $('select[name=avatar]').change(function() {
        $('input[name=image_old]').val($(this).find('option:selected').text());
    });

    $('form[name=form-upload]').submit( function(event) {
        let avatar = $(this).find("input[name=avatar]");
        $(this).find("input[name=avatar]").remove();
        $(this).append(avatar).css({'display': 'none'});
    });

    $("input[name=avatar]").change(function() {
        readURL(this, 'img.preview-avatar');
    });
    

});
