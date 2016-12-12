'use strict';
const ImageModule = require("ui/image");
const utils = require("utils/utils");
const applicationSettings = require("application-settings");
const services = require("./services");

const addPlus = (temp)=>temp>0 ? '+'+temp : temp;

const toast = (...args)=>{
	const d = new Date();
	const timeStamp = '['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']';
	services.toast(args);
	toast.max = (toast.max || 0) + 1;
	applicationSettings.setString('log'+toast.max, timeStamp+args.join(' ')+'\n');
	console.log(applicationSettings.getString('log'+toast.max));
	if (toast.max > 20) {
		toast.max = 0;
		for (let i=1; i<21; i++) {
			applicationSettings.hasKey('log'+i) ? applicationSettings.remove('log'+i) : null;
		}
	} 
};
exports.toast = toast;

let def = null;
let settings = null;
const R = org.nativescript.weatherwidgetnativescript.R; 
const note = services.notifications();
const NOTE_ID = +new Date();
const PENDING_MSG = 'Loading...';
const DEF_LOCATION = {
	lat : 50.0346748, //Kharkiv Location
	lon : 36.345833
}

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
	services.toast(def ? 'Parameters loaded, city='+def.city : 'Parameters didn\'t load.');
    let addon =              addPlus(def.temp) + '\u2103' + '  '
                + '\u2191' + addPlus(def.tHigh) + '\u2103' + '  '
                + '\u2193' + addPlus(def.tLow) + '\u2103';
    
    let ico = def&&def.weather ? R.drawable['o'+def.weather[0].icon] : R.drawable['o01d'];
    note(NOTE_ID, addon, def.city, ico);
    const views = new android.widget.RemoteViews(context.getPackageName(), R.layout.my_widget);
    views.setImageViewResource(R.id.icon, def&&def.weather ? R.drawable['o'+def.weather[0].icon] : R.drawable['o01d']);
    views.setTextViewText(R.id.origin, def&&def.city ? def.city : PENDING_MSG);
    views.setTextViewText(R.id.dateTime, makeDate(def&&def.date ? def.date : null));
    views.setTextViewText(R.id.addons, def&&def.temp ? addon : PENDING_MSG);
    views.setOnClickPendingIntent(R.id.icon, pI); 
    for (let i = 0; i < appWidgetIds.length; i++) {
        appWidgetManager.updateAppWidget(appWidgetIds[i], views);
    }
}
exports.refreshViews = refreshViews;

function main(context, appWidgetManager, appWidgetIds, pI) {
    services.geoLocation()
        .catch((e)=>{
        	let coord=null;
        	applicationSettings.hasKey('weather') 
        		? coord = applicationSettings.getString('weather').coord || DEF_LOCATION 
        		: coord = DEF_LOCATION
        	toast(e);
        	return Promise.resolve({'latitude': coord.lat, 'longitude': coord.lon});
        })
        .then((loc)=>{
			toast('('+loc.latitude.toFixed(2)+', '+loc.longitude.toFixed(2)+')');
            if (applicationSettings.hasKey('weather')) {
            	let def = JSON.parse(applicationSettings.getString('weather'));
            	def&&def.date ? def.date = null : null;
            	refreshViews(context, appWidgetManager, appWidgetIds, pI, def)
            } 
            services.getWeather({'latitude': loc.latitude, 'longitude': loc.longitude})
	            .then(res => {
	            	let def = {};
	                def.city = res.name;
	                def.country = res.sys.country;
	                def.date = +new Date();
	                def.tHigh = Math.round(res.main.temp_max);
	                def.tLow = Math.round(res.main.temp_min);
	                def.weather = res.weather;
	                def.temp = Math.round(res.main.temp);
	                def.coord = res.coord;
	                toast('Weather received.');
	                return def;
	            })
	            .then((def)=>{
	            	applicationSettings.setString('weather', JSON.stringify(def));
	            	toast('settings saved.');
	                refreshViews(context, appWidgetManager, appWidgetIds, pI, def);
	            })
	            .catch((e)=>{
        			toast(e);
	        		note(NOTE_ID+2, 'Network didn\'t response.'+makeDate(+new Date()), e, R.drawable['o01d']);
	        	}); 
    	});
}
exports.main = main;
