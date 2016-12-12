var applicationSettings = require("application-settings");
var services = require("./widget-modules/services");
var ImageModule = require("ui/image");

function myWidgetClass() {
    'use strict';
    var int;
    var taps = -1;
    var temp = '?';
    var date = '?';
    var R = org.nativescript.weatherwidgetnativescript.R; // reduces syntax noise, stands for 'android resources'
    var rng = new java.util.Random();
    const geoLocation = services.geoLoc;
    const getWeather = services.getWeather;
    function makeDate(date) {
        const formattedDate = ''
            +date.getDate() + '/' + date.getMonth() 
            +' '
            +date.getHours()
            +':'
            +( (date.getMinutes()<10) ? '0' + date.getMinutes() : date.getMinutes() );
        return formattedDate;        
    }
    function refreshViews(context, appWidgetManager, appWidgetIds) {
        var views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
        views.setImageViewResource(R.id.imageView1, R.drawable['o'+def.weather[0].icon]);
        views.setTextViewText(R.id.taps_text, makeDate(def.date));
        for (var i = 0; i < appWidgetIds.length; i++) {
            appWidgetManager.updateAppWidget(appWidgetIds[i], views);
        }
    }
    function getAll(context, appWidgetManager, appWidgetIds) {
        geoLocation()
        .then((loc)=>{
            getWeather({coords:{latitude: loc.latitude, longitude: loc.longitude}})
            .then((def)=>{
                refreshViews(context, appWidgetManager, appWidgetIds);
            });
        });
    }
    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget", {
        // is called each time the widget is added to the homescreen, or update ticks
        onUpdate: function (context, appWidgetManager, appWidgetIds) {
            // gets the number of instances of the same widget on the homescreen
            //int&&clearInterval(int);
            console.log('appsett',applicationSettings.hasKey('tapp'));
            
  //          getWeather(context, appWidgetManager, appWidgetIds);
            var appWidgetsLen = appWidgetIds.length;
            //console.log("Update called!",appWidgetsLen, appWidgetIds, Object.keys(appWidgetIds));
            taps += 1;
            // for each widget - update - we want them to be consistent
            for (var i = 0; i < appWidgetsLen; i++) {
               //updateWidget(context, appWidgetManager, appWidgetIds, appWidgetIds[i]);
                var text = '\u2191'+'\u2193'+'\u21BB'+temp.toString()+'\u2103';
                //applicationSettings.hasKey('weather')&&
                var widgetId = appWidgetIds[i];
                var intent = new android.content.Intent(context, com.tns.MyWidget.class);
                intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
                intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);

                //var pI = android.app.PendingIntent.getActivity(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
                //var pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);


                var views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
                //views.setOnClickPendingIntent(R.id.tap_button, pI);
                
                views.setImageViewResource(R.id.icon, R.drawable['o01n']);
                views.setTextViewText(R.id.origin, 'Loading...');
                views.setTextViewText(R.id.dateTime, Date.now().toString());
                appWidgetManager.updateAppWidget(widgetId, views);
            

            }
            getAll(context, appWidgetManager, appWidgetIds);
            
                 
        }
    });



    // function updateWidget(context, appWidgetManager, appWidgetIds, widgetId) {
    //     console.log('UV: ', context, appWidgetManager, appWidgetIds, widgetId);
    //     var text = taps.toString();

    //     // retrieve our layout and all its views
    //     var views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);

    //     views.setTextViewText(R.id.taps_text, text);

    //     var intent = new android.content.Intent(context, com.tns.MyWidget.class);
    //     intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
    //     intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);

    //     var startAppIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); // the activity defined in AndroidManifest
    //     startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);

    //     var pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    //     var pI2 = android.app.PendingIntent.getActivity(context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);

    //     views.setOnClickPendingIntent(R.id.tap_button, pI);
    //     views.setOnClickPendingIntent(R.id.taps_image, pI2);

    //     appWidgetManager.updateAppWidget(widgetId, views);
    //     console.log('***',widgetId, views);
    // }
}
exports.myWidgetClass = myWidgetClass;