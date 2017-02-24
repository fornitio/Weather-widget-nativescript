const applicationSettings = require("application-settings");
const main = require('./utils/main');
const toast = require('./utils/toast');
// const refreshViews = require('./utils/refreshViews');
let settings = null;

(function myWidgetClass() {
    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget", {
        onUpdate: function (context, appWidgetManager, appWidgetIds) {
            // const toast = utilites.toast;
            // const main = utilites.main;
            // const refreshViews = utilites.refreshViews;
            toast('Processing...');
            const intent = new android.content.Intent(context, com.tns.MyWidget.class);
            intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
		  	const pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            main(context, appWidgetManager, appWidgetIds, pI) 
    		
            /*applicationSettings.hasKey('settings') ? settings = JSON.parse(applicationSettings.getString('settings')) : settings = null;
            settings&&settings.sw 
            	? main(context, appWidgetManager, appWidgetIds, pI) 
            	: toast('Network refreshing off.') || applicationSettings.hasKey('weather') 
        			? refreshViews(context, appWidgetManager, appWidgetIds, pI, JSON.parse(applicationSettings.getString('weather')))
        			: refreshViews(context, appWidgetManager, appWidgetIds, pI, null)*/
        }
    });
})();