/*    
const constants = require('./constants');
    const NOTE_ID = constants.NOTE_ID;
    const DEF_LOCATION = constants.DEF_LOCATION;
    const DEF_WEATHER = constants.DEF_WEATHER;
    const tC = constants.TEMP_CELSIUS_SIGN;
    const DEF_ICON = constants.DEF_ICON;*/
const applicationSettings = require("application-settings");
const main = require('./utils/main')();
const constants = require('./utils/constants');
const toast = require('./utils/toast');
const note = require('./utils/statusbarNotifications')();
const log = require('./utils/log')(console.log.bind(console));
const refreshViews = require('./utils/refreshViews')();
//wrapper of refreshViews
const refreshViewsWrapper = (context, appWidgetManager, appWidgetIds, pI) => 
    (isVibration, def) => refreshViews(context, appWidgetManager, appWidgetIds, pI, isVibration, def)
const geolocation = require('./services/geolocation')();
const getForecast = require('./services/getForecast');
//geolocation.initialize();
console.log('class init....');


(function myWidgetClass() {
    android.appwidget.AppWidgetProvider.extend("com.tns.MyWidget", {
        onUpdate: function (context, appWidgetManager, appWidgetIds) {


            toast('Getting forecast');
            const intent = new android.content.Intent(context, com.tns.MyWidget.class);
            intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);
		  	const pI = android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            const rV = refreshViewsWrapper(context, appWidgetManager, appWidgetIds, pI);
            
            if (!refreshViewsWrapper.rv) {
                rV(true, constants.DEF_WEATHER); 
                refreshViewsWrapper.rv=true;
                console.log('rvw: ', refreshViewsWrapper.rv);
            }
            main(rV, geolocation, getForecast, note, applicationSettings, toast, log, constants);
                        // applicationSettings.setString('weather', JSON.stringify(res));
/*                                if (applicationSettings.hasKey('weather')) {
                            let def = JSON.parse(applicationSettings.getString('weather'));
                            
                            refreshViews(def)
                        } 

                        toast(e);
                        note(NOTE_ID+2, 'No connection', e, DEF_ICON, true);
                        
                        settings.lat = loc.latitude;    
                        settings.lon = loc.longitude;
*/

        }
    });
})();