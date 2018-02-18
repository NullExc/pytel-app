$(document).ready(function () {
     $('.button-collapse').sideNav({
      menuWidth: 200, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true,
      onClose: function (el) {
        console.log('sidenav is closed');
        
        function showpanel() {     
          $( "#sidenav-overlay" ).remove();
          $( ".drag-target" ).each(function (el) {
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