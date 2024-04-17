java -jar closure_compiler.jar --js src/develop/js/lightbot.model.game.js --js src/develop/js/lightbot.model.directions.js --js src/develop/js/lightbot.model.bot.js --js src/develop/js/lightbot.model.bot.instructions.js --js src/develop/js/lightbot.model.map.js --js src/develop/js/lightbot.model.map.state.js --js src/develop/js/lightbot.model.box.js --js src/develop/js/lightbot.model.lightbox.js --js src/develop/js/lightbot.model.medals.js --js src/develop/js/lightbot.model.achievements.js --js src/develop/js/lightbot.view.canvas.ui.js --js src/develop/js/lightbot.view.canvas.ui.media.js --js src/develop/js/lightbot.view.canvas.ui.buttons.js --js src/develop/js/lightbot.view.canvas.ui.dialogs.js --js src/develop/js/lightbot.view.canvas.ui.editor.js --js src/develop/js/lightbot.view.canvas.game.js --js src/develop/js/lightbot.view.canvas.map.js --js src/develop/js/lightbot.view.canvas.box.js --js src/develop/js/lightbot.view.canvas.bot.animations.js --js src/develop/js/lightbot.view.canvas.bot.js --js src/develop/js/lightbot.view.canvas.projection.js --js src/develop/js/lightbot.view.canvas.medals.js --js src/develop/js/lightbot.view.canvas.achievements.js --js src/develop/js/lightbot.view.canvas.js --js src/develop/js/lightbot.view.canvas.ui.history.js --compilation_level SIMPLE_OPTIMIZATIONS --externs src/develop/js/jquery-1.7.min.js --externs src/develop/js/jquery-ui-1.8.16.custom.min.js --externs src/develop/js/jquery.jplayer.min.js --externs src/develop/js/jquery.history.js --warning_level QUIET --js_output_file src/deploy/js/lightbot.min.js

copy src\develop\css\smoothness\jquery-ui-1.8.16.custom.css+src\develop\css\jplayer.css+src\develop\css\lightbot.css src\deploy\css\lightbot.min.css

java -jar yuicompressor-2.4.6.jar -o src\deploy\css\lightbot.min.css src\deploy\css\lightbot.min.css

rmdir /S /Q deploy
mkdir deploy
xcopy resources\img deploy\img /E /Q /Y /I
xcopy resources\media deploy\media /E /Q /Y /I
xcopy src\deploy deploy /E /Q /Y /I
xcopy www\deploy deploy /E /Q /Y /I