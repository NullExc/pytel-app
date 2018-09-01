console.log(document.readyState);

$(document).ready(function () {

  $(".dropdown-trigger").dropdown();

  $('select').formSelect();

  $('.fixed-action-btn').floatingActionButton();

  //$('.tabs').tabs();

  M.Tabs.init($('.tabs'), {});

  window.addEventListener('load', function () {
    console.log('document was not ready, place code here!!');
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'up',
      hoverEnabled: false
    });
  });

  $('.sidenav').sidenav({
    menuWidth: 200, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true,
    onClose: function (el) {
      console.log('sidenav is closed');

      function showpanel() {
        $("#sidenav-overlay").remove();
        $(".drag-target").each(function (el) {
          if (!$(this).hasClass('ng-isolate-scope')) {
            $(this).remove();
          }
          //console.log('target', $(this).hasClass('ng-isolate-scope'));
        })
      }

      // use setTimeout() to execute
      setTimeout(showpanel, 500);
    }
  }
  );
})

/*$(document).ready(function () {
  
  $(".dropdown-trigger").dropdown();
        
  $('.button-collapse').sidenav();
})*/