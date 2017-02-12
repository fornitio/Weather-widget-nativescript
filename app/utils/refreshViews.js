const PENDING_MSG = require('./constants').PENDING_MSG;

const addPlus = (temp)=>temp>0 ? '+'+temp : temp;

function makeDate(date) {
    if (!date) return PENDING_MSG
    date = new Date(+date);
    const formattedDate = ''
        +date.getDate() + '/' + (date.getMonth() + 1)
        +' '
        +date.getHours()
        +':'
        +( (date.getMinutes()<10) ? '0' + date.getMinutes() : date.getMinutes() );
    return formattedDate;        
}


function refreshViews(context, appWidgetManager, appWidgetIds, pI, def) {
	const note = require('./statusbarNotifications')();
    const NOTE_ID = require('./constants').NOTE_ID;
	
    const R = org.nativescript.weatherwidgetnativescript.R; 
    const addon =            addPlus(def&&def.temp) + '\u2103' + '  '
                + '\u2191' + addPlus(def&&def.tHigh) + '\u2103' + '  '
                + '\u2193' + addPlus(def&&def.tLow) + '\u2103';
    const cityStr = (def&&def.city ? def.city : PENDING_MSG) + (def&&def.country ? (', ' + def.country) : null);
    const dateStr = makeDate(def&&def.date ? def.date : null);
    const tempStr =def&&def.temp ? addon : PENDING_MSG;
    const ico = def&&def.weather ? R.drawable['o'+def.weather[0].icon] : R.drawable['o01d'];
    note(NOTE_ID, addon, cityStr, ico);
    
    const views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
    views.setImageViewResource(R.id.icon, ico);
    views.setTextViewText(R.id.origin, cityStr);
    views.setTextViewText(R.id.dateTime, dateStr);
    views.setTextViewText(R.id.addons, tempStr);
    views.setOnClickPendingIntent(R.id.spin, pI); 
    for (let i = 0; i < appWidgetIds.length; i++) {
        appWidgetManager.updateAppWidget(appWidgetIds[i], views);
    }
}
module.exports = refreshViews;
