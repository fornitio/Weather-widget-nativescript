const main = () => {
	//main magic
	return (refreshViews, geolocation, getForecast, note, applicationSettings, toast, log, constants, permissions) => {
		//initialization
		const NOTE_ID = constants.NOTE_ID;
		const DEF_LOCATION = constants.DEF_LOCATION;
		const DEF_WEATHER = constants.DEF_WEATHER;
		const tC = constants.TEMP_CELSIUS_SIGN;
		const DEF_ICON = constants.DEF_ICON;
        
		let settings = applicationSettings.hasKey('settings') 
			? JSON.parse(applicationSettings.getString('settings')) 
			: {};
		if ( typeof settings !== 'object' ) { settings = {} };

		let def = applicationSettings.hasKey('weather')
			? JSON.parse(applicationSettings.getString('weather'))
			: DEF_WEATHER;
		if ( def && !isFinite(def.temp) ) { def = DEF_WEATHER };
	    
        const toaster = settings.isToast ? (...args)=>{toast(args);log(args)} : log;

        const defLocationPromise = Promise.resolve({
            'latitude' : settings.lat || constants.DEF_LOCATION.lat, 
            'longitude' : settings.lon || constants.DEF_LOCATION.lon });

        const locationPromise = new Promise(function(resolve, reject) {
			if (permissions.hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)) {
				toaster("Permissions Granted.");
				return geolocation.getCurrent()
		        	.then(val=>{
		        		resolve(val);
		        	})
		        	.catch(e=>{reject(e)})
			} else {
				note(NOTE_ID, 'Permissions required', 'ACCESS_FINE_LOCATION', DEF_ICON, true);
				return permissions.requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION, "Permissions request")
				    .then(function() {
				        toaster("Permissions Granted.");
				        return geolocation.getCurrent()
				        	.then(val=>{
				        		resolve(val);
				        	})
				    })
				    .catch((e)=>{
				        toaster("No Permissions.");
						note(NOTE_ID, 'No Permissions.', 'ACCESS_FINE_LOCATION', DEF_ICON, true);
				        reject("No Permissions.");
				    });
			}
        });

       	const location = settings.sw ? locationPromise : defLocationPromise;
	    //obtain information
	    location
	        .catch((e)=>{
	        	toaster(e);
	        	return defLocationPromise;
	        })
	        .then((loc)=>{
				toaster('('+loc.latitude.toFixed(1)+', '+loc.longitude.toFixed(1)+')');
	        	settings.lat = loc.latitude;	
	        	settings.lon = loc.longitude;
	        	applicationSettings.setString('settings', JSON.stringify(settings));
	            getForecast({'latitude': loc.latitude, 'longitude': loc.longitude}, fetch)
		            .then((res)=>{
		            	applicationSettings.setString('weather', JSON.stringify(res));
		            	toaster( res ? (res.temp + tC + ' ' + res.city) : ('Server\'s response: '+JSON.stringify(res)) );
		                refreshViews(settings.isVibration, res);
		            })
		            .catch((e)=>{
						if (applicationSettings.hasKey('weather')) {
							let def = JSON.parse(applicationSettings.getString('weather'));
							refreshViews(settings.isVibration, def)
						} 
	        			toaster(e);
		        		note(NOTE_ID+2, 'No connection', e, DEF_ICON, true);
		        	}); 
	    	});
	}
}
module.exports = main;
