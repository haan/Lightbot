$(document).ready(function() {
  /* DIALOGS */
  $("div#levelCompleteDialog").dialog({
    draggable: false,
    autoOpen: false,
    modal: true,
    width: 400,
    height: 200,
    stack: false,
    resizable: false,
    close: function() {
      // TODO show level select screen
      //showLevelSelectScreen();
    },
    buttons: {
      Ok: function() {
        $( this ).dialog( "close" );
      }
    }
  });

  $("div#achievementDialog").dialog({
    draggable: false,
    autoOpen: false,
    modal: true,
    width: 400,
    height: 200,
    stack: true,
    resizable: false,
    close: function() {
      lightBot.achievements.display(); // display the next achievement if available
    },
    buttons: {
      Ok: function() {
        $( this ).dialog( "close" );
      }
    }
  });
});