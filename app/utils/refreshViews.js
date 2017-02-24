const PENDING_MSG = require('./constants').PENDING_MSG;
const tC = require('./constants').TEMP_CELSIUS_SIGN;
const tHigh = require('./constants').TEMP_HIGH_SIGN;
const tLow = require('./constants').TEMP_LOW_SIGN;
const gap = require('./constants').TEMP_GAP_SIGN;
const NOTE_ID = require('./constants').NOTE_ID;
const note = require('./statusbarNotifications')();


const addPlus = (temp)=>temp>0 ? '+'+temp : temp;

function makeDate(date) {
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


function refreshViews(context, appWidgetManager, appWidgetIds, pI, def) {
    const R = org.nativescript.weatherwidgetnativescript.R; 
    const addon =         addPlus(def&&def.temp) + tC + gap
                + tHigh + addPlus(def&&def.tHigh) + tC + gap
                + tLow + addPlus(def&&def.tLow) + tC;
    const cityStr = (def&&def.city ? def.city : PENDING_MSG) + (def&&def.country ? (', ' + def.country) : '');
    const dateStr = makeDate(def&&def.date ? def.date : null);
    const tempStr = def && isFinite(def.temp) ? addon : PENDING_MSG;
    const ico = def && def.weather && def.weather[0] && def.weather[0].icon ? R.drawable['o'+def.weather[0].icon] : R.drawable['o01d'];
    
    const views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
    views.setImageViewResource(R.id.icon, ico);
    views.setTextViewText(R.id.origin, cityStr);
    views.setTextViewText(R.id.dateTime, dateStr);
    views.setTextViewText(R.id.addons, tempStr);
    views.setOnClickPendingIntent(R.id.spin, pI); 
    for (let i = 0; i < appWidgetIds.length; i++) {
        appWidgetManager.updateAppWidget(appWidgetIds[i], views);
    }
    note(NOTE_ID, addon, cityStr, ico);
}
module.exports = refreshViews;
