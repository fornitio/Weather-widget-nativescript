'use strict';
const ImageModule = require("ui/image");
const utils = require("utils/utils");	
const applicationSettings = require("application-settings");
const tst = require('./toast');
const note = require('./statusbarNotifications')();
const geolocation = require('../services/geolocation');
const getForecast = require('../services/getForecast')
const refreshViews = require('./refreshViews');

const NOTE_ID = require('./constants').NOTE_ID;
const DEF_LOCATION = require('./constants').DEF_LOCATION;
const R = org.nativescript.weatherwidgetnativescript.R; 

const toast = (...args)=>{
	const d = new Date();
	const timeStamp = '['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']';
	tst(args);
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

function main(context, appWidgetManager, appWidgetIds, pI) {
	let settings = {};
	applicationSettings.hasKey('settings') 
		? settings = JSON.parse(applicationSettings.getString('settings')) 
		: settings = {};

	const location = settings.sw 
		? geolocation() 
		: (Promise.resolve({'latitude' : settings.lat || DEF_LOCATION.lat, 
							'longitude' : settings.lon || DEF_LOCATION.lon
						}));
    location
        .catch((e)=>{
        	toast(e);
        	return Promise.resolve({'latitude': DEF_LOCATION.lat, 'longitude': DEF_LOCATION.lon});
        })
        .then((loc)=>{
			toast('('+loc.latitude.toFixed(2)+', '+loc.longitude.toFixed(2)+')');
        	settings.lat = loc.latitude;
        	settings.lon = loc.longitude;
        	applicationSettings.setString('settings', JSON.stringify(settings));
        	console.log((applicationSettings.getString('settings')) ); 
            
            if (applicationSettings.hasKey('weather')) {
            	let def = JSON.parse(applicationSettings.getString('weather'));
            	def&&def.date ? def.date = null : null;
            	refreshViews(context, appWidgetManager, appWidgetIds, pI, def)
            } 
            getForecast({'latitude': loc.latitude, 'longitude': loc.longitude})
	            .then((def)=>{
	            	applicationSettings.setString('weather', JSON.stringify(def));
	            	//toast('settings saved.');
	                refreshViews(context, appWidgetManager, appWidgetIds, pI, def);
	            })
	            .catch((e)=>{
					if (applicationSettings.hasKey('weather')) {
						let def = JSON.parse(applicationSettings.getString('weather'));
						refreshViews(context, appWidgetManager, appWidgetIds, pI, def)
					} 

        			toast(e);
	        		note(NOTE_ID+2, 'Network didn\'t response.', e, R.drawable['o01d']);
	        	}); 
    	});
}
module.exports = main;
