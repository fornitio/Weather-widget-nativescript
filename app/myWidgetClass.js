const applicationSettings = require("application-settings");
const main = require('./utils/main')();
const constants = require('./utils/constants');
const toast = require('./utils/toast');
const note = require('./utils/statusbarNotifications')();
const log = require('./utils/log')(console.log.bind(console));
const permissions = require('nativescript-permissions');
const refreshViews = require('./utils/refreshViews')();
//wrapper of refreshViews
const refreshViewsWrapper = (context, appWidgetManager, appWidgetIds, pI) => 
    (isVibration, def) => refreshViews(context, appWidgetManager, appWidgetIds, pI, isVibration, def)
const geolocation = require('./services/geolocation')();
const getForecast = require('./services/getForecast')( fetch, constants.URI, {method : 'GET', mode : 'cors'} );

(function myWidgetClass() {
    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget", {
        onUpdate: function (context, appWidgetManager, appWidgetIds) {
            //toast('Obtaining...');
            const intent = new android.content.Intent(context, com.tns.MyWidget.class);
            intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
		  	const pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            const rV = refreshViewsWrapper(context, appWidgetManager, appWidgetIds, pI);
            if (!refreshViewsWrapper.rv) {
                rV(true, constants.DEF_WEATHER); 
                refreshViewsWrapper.rv=true;
            }
            main(rV, geolocation, getForecast, note, applicationSettings, toast, log, constants, permissions);
        }
    });
})();