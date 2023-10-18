



////////////////////////////////////////////////////////////////
//////////////////////// CNIC Validation //////////////////////
//////////////////////////////////////////////////////////////    
$(".CNIC").keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    if (e.shiftKey) {
        $('#txtID').focus();
    } else {
        return (
            key == 8 ||
            //key == 109 ||
            //key == 189 ||
            key == 9 ||
            //key == 46 ||
            (key >= 37 && key <= 40) ||
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105)
        );
    }
});

$('.CNIC').mousedown(function (event) {
    switch (event.which) {
        case 1:
            //alert('Copy, Paste not allowed.');
            break;
        case 2:
            //alert('Copy, Paste not allowed.');
            break;
        case 3:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed.');
            break;
        default:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed!');
    }
});

$(".CNIC").keypress(function (e) {
    var Dash = '';

    var myLength = 1;
    var myLength = $(this).val().length;

    if (myLength == 5 || myLength == 13) {
        Dash = $(this).val() + '-';
        $(this).val(Dash);
    }
});

///////////////// End CNIC Validation ////////////////////////


///////////////////////////////////////////////////////////////
//////////////////////// Mobile Number Validation //////////////////////
//////////////////////////////////////////////////////////////    
$(".Mobile").keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    if (e.shiftKey) {
        $('#txtID').focus();
    } else {
        return (
            key == 8 ||
            //key == 109 ||
            //key == 189 ||
            key == 9 ||
            //key == 46 ||
            (key >= 37 && key <= 40) ||
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105)
        );
    }
});

$('.Mobile').mousedown(function (event) {
    switch (event.which) {
        case 1:
            //alert('Copy, Paste not allowed.');
            break;
        case 2:
            //alert('Copy, Paste not allowed.');
            break;
        case 3:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed.');
            break;
        default:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed!');
    }
});

$(".Mobile").keypress(function (e) {
    var Dash = '';

    var myLength = 1;
    var myLength = $(this).val().length;

    if (myLength == 4) {
        Dash = $(this).val() + '-';
        $(this).val(Dash);
    }
});
///////////////// End Mobile Number Validation ////////////////////////



///////////////////////////////////////////////////////////////
//////////////////////// Landline Number Validation //////////////////////
//////////////////////////////////////////////////////////////    
$(".Phone").keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    if (e.shiftKey) {
        $('#txtID').focus();
    } else {
        return (
            key == 8 ||
            //key == 109 ||
            //key == 189 ||
            key == 9 ||
            //key == 46 ||
            (key >= 37 && key <= 40) ||
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105)
        );
    }
});

$('.Phone').mousedown(function (event) {
    switch (event.which) {
        case 1:
            //alert('Copy, Paste not allowed.');
            break;
        case 2:
            //alert('Copy, Paste not allowed.');
            break;
        case 3:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed.');
            break;
        default:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed!');
    }
});

$(".Phone").keypress(function (e) {
    var Dash = '';

    var myLength = 1;
    var myLength = $(this).val().length;

    if (myLength == 3) {
        Dash = $(this).val() + '-';
        $(this).val(Dash);
    }
});



///////////////////////////////////////////////////////////////
//////////////////////// IP Address Validation //////////////////////
//////////////////////////////////////////////////////////////    
$(".IP").keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    if (e.shiftKey) {
        $('#txtID').focus();
    } else {
        return (
            key == 8 ||
            //key == 109 ||
            //key == 189 ||
            key == 9 ||
            //key == 46 ||
            (key >= 37 && key <= 40) ||
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105)
        );
    }
});

$('.IP').mousedown(function (event) {
    switch (event.which) {
        case 1:
            //alert('Copy, Paste not allowed.');
            break;
        case 2:
            //alert('Copy, Paste not allowed.');
            break;
        case 3:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed.');
            break;
        default:
            genAlert($(this), 'Copy, Paste not allowed.', 'error');
            //alert('Copy, Paste not allowed!');
    }
});

$(".IP").keypress(function (e) {
    var Dash = '';

    var myLength = 1;
    var myLength = $(this).val().length;

    if (myLength == 3 || myLength == 7 || myLength == 11) {
        Dash = $(this).val() + '.';
        $(this).val(Dash);
    }
});




///////////////// End ip address Validation ////////////////////////



//////////////////////////////////////////////////////////////
/////////////////// Calculate Age ////////////////////////////
//////////////////////////////////////////////////////////////
function calculateAge(dateMonth, dateDay, dateYear) {
    todayDate = new Date();
    todayYear = todayDate.getFullYear();
    todayMonth = todayDate.getMonth();
    todayDay = todayDate.getDate();
    age = todayYear - dateYear;

    if (todayMonth < dateMonth - 1) {
        age--;
    }

    if (dateMonth - 1 == todayMonth && todayDay < dateDay) {
        age--;
    }
    return age;
}
/////////////////// end Calculate Age /////////////////////////



/***************** Digital Grouping *************************/
function digits(numVal) {
    return numVal.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
}

/**************** Animation *********************/
function testAnim(anim, obj) {
    $(obj).removeClass(anim + ' animated').addClass(anim + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(obj).removeClass(anim + ' animated');
    });
};

/**************** Generate Alert ****************/
//Generate Alert
function genAlert(objname, msgtxt, type) {

    if (type == 'error') {
        swal("Sorry...", msgtxt, "error");
    }
    else if (type == 'success') {
        swal("Good job!", msgtxt, "success")
    }

}

function emailValidation(Email) {

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(Email)) {
        return false;
    } else {
        return true;
    }
}

function validateWebsite(website) {

    var filter = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;

    //var filter = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;

    if (!filter.test(website)) {
        return false;
    } else {
        return true;
    }
}

//------------convert date 
function convertDate(myDate) {

    var oldDate = new Date(myDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = d + "-" + m + "-" + y;

    return convertedDate;

}

//-----------calculate date of birth  
function calDOB(myDate) {

    var oldDate = new Date(myDate);
    var day = oldDate.getDate();
    var month = oldDate.getMonth();
    // m += 1;  // JavaScript months are 0-11
    var year = oldDate.getFullYear();

    var age = 15;

    var mydate = new Date();
    mydate.setFullYear(year, month - 1, day);

    var currdate = new Date();
    currdate.setFullYear(currdate.getFullYear() - age);

    if ((currdate - mydate) < 0) {
        //alert("Sorry, only persons over the age of " + age + " may enter this site");
        return false;
    }
    return true;
}


function calculateAge(myDate, age) {

    var oldDate = new Date(myDate);
    var day = oldDate.getDate();
    var month = oldDate.getMonth();
    // m += 1;  // JavaScript months are 0-11
    var year = oldDate.getFullYear();

    var mydate = new Date();
    mydate.setFullYear(year, month - 1, day);

    var currdate = new Date();
    currdate.setFullYear(currdate.getFullYear() - age);

    if ((currdate - mydate) < 0) {
        //alert("Sorry, only persons over the age of " + age + " may enter this site");
        return false;
    }
    return true;
}


function calculateCaton(TotalQty, Packing) {

    //alert(TotalQty + " - " + Packing);
    var caton = TotalQty / Packing;

    caton = parseFloat(caton);
    //alert(caton);
    return caton;
}


function calculatePieces(TotalQty, Packing) {

    //alert(TotalQty + " - " + Packing);

    var caton = TotalQty / Packing;

    caton = parseFloat(caton);

    var e = caton * Packing;
    var pieces = TotalQty - e;

    return pieces;
}

//-----------calculate date of joining  
function calDOJ(myDOB, myDOJ) {

    var currdate = new Date(myDOB);
    currdate.setFullYear(currdate.getFullYear() + 15);

    //return currdate;
    //return false;


    newDate = new Date();

    if (myDOJ < currdate) {
        return false;
    } else if (myDOJ > newDate) {
        return false;
    } else {
        return true;
    }

}

//-----------convert time
function convertTime(myTimee) {

    myTime = new Date("Fri Jan 22 2016 " + myTimee + ":00 GMT+0500 (Pakistan Standard Time)");

    var dateString = '';

    var h = myTime.getHours();
    var m = myTime.getMinutes();
    var s = myTime.getSeconds();

    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;

    dateString = h + ':' + m + ':' + s;

    return dateString;

}

//----------match 2 times
function matchTime(startTime, endTime) {
    if (Date.parse("1-1-2000 " + startTime) >= Date.parse("1-1-2000 " + endTime)) {
        return false;
    } else {
        return true;
    }
}

//----------function for display image 
function showImg(input, img_id) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            img_id.attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

//------------validate date 
function validateDate(firstDate, secondDate) {

    if (firstDate > secondDate) {
        return false;
    } else {
        return true;
    }

}

//-------123 & - only
function numonly(){
    $(".numOnly").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57) ) {
            event.preventDefault();
        }
    });
}


$(".floatOnly").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

//-------abc only
$(".abcOnly").bind('keypress keyup blur', function () {
    $(this).val($(this).val().replace(/[^A-Z a-z]/g, ""));
});

//-------not writeable
$(".emptyField").bind('keypress keyup', function () {
    //$(this).val("");
    return false;
});

//-------------Loader 
function showLoader() {
    $('.myLoader').css('display', 'block');
}

function hideLoader() {
    $('.myLoader').css('display', 'none');
}


function clearCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var vals = cookies[i].split("=");
        document.cookie = vals[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 UTC;";
    }
}

// you will need jquery for this
$(window).on('beforeunload', function () {
    clearCookies()
});

/******************* Convert Date *********************/
function setDate(myDate) {

    var getfullDate = myDate.split('T');

    var getShortDate = getfullDate[0].split('-');

    var getYear = getShortDate[0];
    var getMonth = getShortDate[1];
    var getDay = getShortDate[2];

    return (getMonth + '/' + getDay + '/' + getYear);

}

/* change Date Format */
function setDateFormat(date) {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return (monthIndex + 1) + '/' + day + '/' + year;
};

function setDateFormatForSearch(date) {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var month = monthIndex + 1;

    if (month < 10){
        month = '0' + month;
    }

    return year + '-' + month + '-' + day;
};

// Click on Brand Header
$(document).ready(function () {
    $("#one").click(function () {
        $('#divStartUp').show();
    });
});

//setting of sub-menu
$('.myli').click(function () {

    $(this).addClass('myactive')
         .siblings()
         .removeClass('myactive');

});


// cnic mask
function setCNICMask() {
    $('#CNIC').mask("00000-0000000-0");
}

// ntn mask
function setNTNMask() {
    $('#ntn').mask("00000000-0");
}

// phone mask
function setPhoneMask() {
    $('#phone').mask("(000)-0000000");
}

// mobile mask
function setMobileMask() {
    $('#mobile').mask("0000-0000000");
}
