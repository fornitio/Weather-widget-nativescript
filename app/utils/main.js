const main = () => {
	//main magic
	return (refreshViews, geolocation, getForecast, note, applicationSettings, toast, log, constants) => {
		//initialization
		const NOTE_ID = constants.NOTE_ID;
		const DEF_LOCATION = constants.DEF_LOCATION;
		const DEF_WEATHER = constants.DEF_WEATHER;
		const tC = constants.TEMP_CELSIUS_SIGN;
		const DEF_ICON = constants.DEF_ICON;
		geolocation.disconnect();
		geolocation.connect();

		let settings = applicationSettings.hasKey('settings') 
			? JSON.parse(applicationSettings.getString('settings')) 
			: {};
		if ( typeof settings !== 'object' ) { settings = {} };

		let def = applicationSettings.hasKey('weather')
			? JSON.parse(applicationSettings.getString('weather'))
			: DEF_WEATHER;
		if ( def && !isFinite(def.temp) ) { def = DEF_WEATHER };
	    
        const defLocationPromise = Promise.resolve({
            'latitude' : settings.lat || constants.DEF_LOCATION.lat, 
            'longitude' : settings.lon || constants.DEF_LOCATION.lon });
       	 const location = settings.sw ? geolocation.getCurrent() : defLocationPromise;
        const toaster = settings.isToast ? (...args)=>{toast(args);log(args)} : log;
	    //obtain information
	    location
	        .catch((e)=>{
	        	toast(e);
	        	return defLocationPromise;
	        })
	        .then((loc)=>{
				toast('('+loc.latitude.toFixed(1)+', '+loc.longitude.toFixed(1)+')');
	        	settings.lat = loc.latitude;	
	        	settings.lon = loc.longitude;
	        	applicationSettings.setString('settings', JSON.stringify(settings));
	            geolocation.disconnect();
	            getForecast({'latitude': loc.latitude, 'longitude': loc.longitude}, fetch)
		            .then((res)=>{
		            	applicationSettings.setString('weather', JSON.stringify(res));
		            	toast( res ? (res.temp + tC + ' ' + res.city) : ('Server\'s response: '+JSON.stringify(res)) );
		                refreshViews(settings.isVibration, res);
		            })
		            .catch((e)=>{
						if (applicationSettings.hasKey('weather')) {
							let def = JSON.parse(applicationSettings.getString('weather'));
							refreshViews(settings.isVibration, def)
						} 
	        			toast(e);
		        		note(NOTE_ID+2, 'No connection', e, DEF_ICON, true);
		        	}); 
	    	});
	}
}
module.exports = main;
