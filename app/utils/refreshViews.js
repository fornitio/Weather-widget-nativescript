const refreshViews = () => {    
    //initialization
    const R = org.nativescript.weatherwidgetnativescript.R;
    const constants = require('./constants');
    const PENDING_MSG = constants.PENDING_MSG;
    const tC = constants.TEMP_CELSIUS_SIGN;
    const tHigh = constants.TEMP_HIGH_SIGN;
    const tLow = constants.TEMP_LOW_SIGN;
    const gap = constants.TEMP_GAP_SIGN;
    const NOTE_ID = constants.NOTE_ID;
    const DEF_ICON = constants.DEF_ICON;
    const note = require('./statusbarNotifications')();
    const addPlus = (temp) => temp>0 ? '+'+temp : temp;
    const makeDate = (date) => {
        if (!date) return PENDING_MSG
        date = new Date(+date);
        const formattedDate = ''
            +date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            +'  '
            +date.getHours()
            +':'
            +( (date.getMinutes()<10) ? '0' + date.getMinutes() : date.getMinutes() );
        return formattedDate;        
    }
    //main magic
    return (context, appWidgetManager, appWidgetIds, pI, isVibration, def) => {
        //preparing data to view
        const addon =         addPlus(def&&def.temp) + tC + gap
                    + tHigh + addPlus(def&&def.tHigh) + tC + gap
                    + tLow + addPlus(def&&def.tLow) + tC;
        const cityStr = (def&&def.city ? def.city : PENDING_MSG) + (def&&def.country ? (', ' + def.country) : '');
        const dateStr = makeDate(def&&def.date ? def.date : null);
        const tempStr = def && isFinite(def.temp) ? addon : PENDING_MSG;
        const ico = def && def.weather && def.weather[0] && def.weather[0].icon ? R.drawable['o'+def.weather[0].icon] : DEF_ICON;
        
        //doing magic
        const views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
        views.setImageViewResource(R.id.icon, ico);
        views.setTextViewText(R.id.origin, cityStr);
        views.setTextViewText(R.id.dateTime, dateStr);
        views.setTextViewText(R.id.addons, tempStr);
        views.setOnClickPendingIntent(R.id.spin, pI); 
        for (let i = 0; i < appWidgetIds.length; i++) {
            appWidgetManager.updateAppWidget(appWidgetIds[i], views);
        }
        note(NOTE_ID, addon, cityStr, ico, isVibration);
    }
}
module.exports = refreshViews;
