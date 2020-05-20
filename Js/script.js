
// var menuicons = document.getElementById("menubar");
// var sidebar = document.getElementById("side-bar");

// menuicons.addEventListener('click', function() {

//     wrapper.classList.toggle('collapse');
  
// });

// var menuList = document.getElementById("menu-icons");
// menuList.addEventListener("click",function(){
// menuList.classList.add("selected");
// });

$("li").click(function(){
 $(this).addClass('selected').siblings().removeClass('selected');
});

$(".hamburger-menu").click(function(){
  
     
    $(".mobile-nav").toggleClass("active");

});