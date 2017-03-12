const applicationSettings = require("application-settings");
const main = require('./utils/main')();
const constants = require('./utils/constants');
const toast = require('./utils/toast');
const note = require('./utils/statusbarNotifications')();
const log = require('./utils/log')(console.log.bind(console));
const refreshViews = require('./utils/refreshViews')();
//wrapper of refreshViews
const refresher = (context, appWidgetManager, appWidgetIds, pI, isVibration) => 
    def => refreshViews(context, appWidgetManager, appWidgetIds, pI, isVibration, def)
const geolocation = require('./services/geolocation');
const getForecast = require('./services/getForecast');


(function myWidgetClass() {
    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget", {
        onUpdate: function (context, appWidgetManager, appWidgetIds) {

            //initialization
            const settings = applicationSettings.hasKey('settings') 
                ? JSON.parse(applicationSettings.getString('settings')) 
                : {};
            if ( typeof settings !== 'object' ) { settings = {} };
            const defLocationPromise = Promise.resolve({
                'latitude' : settings.lat || constants.DEF_LOCATION.lat, 
                'longitude' : settings.lon || constants.DEF_LOCATION.lon });
            const location = settings.sw ? geolocation() : defLocationPromise;
            const toaster = settings.isToast ? (...args)=>{toast(args);log(args)} : log;

            toast('Getting forecast');
            const intent = new android.content.Intent(context, com.tns.MyWidget.class);
            intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
		  	const pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            const rV = refresher(context, appWidgetManager, appWidgetIds, pI, settings.isVibration);
            main(rV, location, getForecast, note, applicationSettings, toaster);
        }
    });
})();