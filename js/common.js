"use strict";

// header quickMenu click event
function tabMenu(clickMenu) {
  $(clickMenu).click(function () {
    $(this).addClass("on");
    $(this).siblings().removeClass("on");
  });
}

tabMenu($(".quickMenu li")); //tabMenu($(".mainTab > ul li"));

tabMenu($(".numberIssuance a")); //tabMenu($(".passTab > ul li"));
// content tab menu

function moveTab(tabName, tabLeft, tabRight) {
  $(tabLeft).click(function () {
    $(tabName).removeClass("moveRight");
    $(tabName).addClass("moveLeft");
    $(".leftTab").css({
      "display": "block"
    });
    $(".rightTab").css({
      "display": "none"
    });
  });
  $(tabRight).click(function () {
    $(tabName).removeClass("moveLeft");
    $(tabName).addClass("moveRight");
    $(".rightTab").css({
      "display": "block"
    });
    $(".leftTab").css({
      "display": "none"
    });
  });
} //moveTab($(".mainTab > ul"), $(".mainTab ul .left"), $(".mainTab ul .right"));
//moveTab($(".passTab > ul"), $(".passTab ul .left"), $(".passTab ul .right"));
// nav popup


function navPop() {
  $("nav > a").click(function () {
    $("nav > div").addClass("on");
    $("body, html").css({
      "overflow-y": "hidden"
    });
    $(".quickMenu").css({
      "display": "none"
    });
  });
  $("nav > div > a").click(function () {
    $(this).parent().removeClass("on");
    $("body, html").css({
      "overflow-y": "auto"
    });
    $(".quickMenu").css({
      "display": "flex"
    });
  });
}

navPop();
//# sourceMappingURL=maps/common.js.map