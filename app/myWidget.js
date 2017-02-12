function myWidgetClass() {
    var R = org.nativescript.weatherwidgetnativescript.R; // reduces syntax noise, stands for 'android resources'
    var rng = new java.util.Random();

    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget", {
        // is called each time the widget is added to the homescreen, or update ticks
        onUpdate: function (context, appWidgetManager, appWidgetIds) {
            // gets the number of instances of the same widget on the homescreen
            var appWidgetsLen = appWidgetIds.length;
            // for each widget - update - we want them to be consistent
            for (var i = 0; i < appWidgetsLen; i++) {
                var widgetId = appWidgetIds[i];
                var intent = new android.content.Intent(context, com.tns.MyWidget.class); // the activity defined in AndroidManifest
                intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
                intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);

                var views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
                views.setImageViewResource(R.id.icon, R.drawable['o01n']);
                views.setTextViewText(R.id.origin, '...');
                views.setTextViewText(R.id.dateTime, Date.now().toString());
                appWidgetManager.updateAppWidget(widgetId, views);
            }
        }
    });

}
exports.myWidgetClass = myWidgetClass;