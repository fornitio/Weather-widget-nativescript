const main = () => {
	const constants = require('./constants');
	const NOTE_ID = constants.NOTE_ID;
	const DEF_LOCATION = constants.DEF_LOCATION;
	const DEF_WEATHER = constants.DEF_WEATHER;
	const tC = constants.TEMP_CELSIUS_SIGN;
	const DEF_ICON = constants.DEF_ICON;

	//main magic
	return (refreshViews, location, getForecast, note, applicationSettings, toast) => {
		//initialization
		let settings = applicationSettings.hasKey('settings') 
			? JSON.parse(applicationSettings.getString('settings')) 
			: {};
		if ( typeof settings !== 'object' ) { settings = {} };

		let def = applicationSettings.hasKey('weather')
			? JSON.parse(applicationSettings.getString('weather'))
			: DEF_WEATHER;
		if ( def && !isFinite(def.temp) ) { def = DEF_WEATHER };
	    refreshViews(def);
	    
	    //obtain information
	    location
	        .catch((e)=>{
	        	toast(e);
	        	return Promise.resolve({'latitude': DEF_LOCATION.lat, 'longitude': DEF_LOCATION.lon});
	        })
	        .then((loc)=>{
				toast('('+loc.latitude.toFixed(1)+', '+loc.longitude.toFixed(1)+')');
	        	settings.lat = loc.latitude;	
	        	settings.lon = loc.longitude;
	        	applicationSettings.setString('settings', JSON.stringify(settings));
	        	//console.log((applicationSettings.getString('settings')) ); 
	            getForecast({'latitude': loc.latitude, 'longitude': loc.longitude}, fetch)
		            .then((def)=>{
		            	applicationSettings.setString('weather', JSON.stringify(def));
		            	toast( def ? (def.temp + tC + ' ' + def.city) : ('Server response: '+JSON.stringify(def)) );
		                refreshViews(def);
		            })
		            .catch((e)=>{
						if (applicationSettings.hasKey('weather')) {
							let def = JSON.parse(applicationSettings.getString('weather'));
							refreshViews(def)
						} 

	        			toast(e);
		        		note(NOTE_ID+2, 'No connection', e, DEF_ICON, true);
		        	}); 
	    	});
	}
}
module.exports = main;
