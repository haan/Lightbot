/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

$(document).ready(function() {
  $("div#levelCompleteDialog").dialog({
    draggable: false,
    autoOpen: false,
    modal: true,
    width: 400,
    height: 200,
    stack: false,
    resizable: false,
    close: function() {
      lightBot.ui.showLevelSelectScreen();
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