function geoLocation() {
    const geolocation = require('nativescript-geolocation');
    const platformModule = require("platform");
    const sdk = platformModule.device.sdkVersion;
    const options = { desiredAccuracy: 3, 
    			        updateDistance: 0.1, 
    			        maximumAge: 20000, 
    			        timeout: 20000 
    				};
    const geo = new Promise (( res, rej )=>{
    	if (sdk >= 23) {rej(new Error('Version of SDK didn\'t match. Geolocation disabled. Please fill the coordinates manually.')); return}
		if (!geolocation.isEnabled()) {
		    geolocation.enableLocationRequest()
		    	.then(()=>{
					geolocation.getCurrentLocation(options)
							.then((coordinates)=>{
								res(coordinates)
							})
		    		
		    	})
		    	.catch((e)=>{ rej(e) });
		} else 	geolocation.getCurrentLocation(options)
							.then((coordinates)=>{
								res(coordinates)
							})
							.catch((e)=>{ rej(e) });
	});
    return geo;
}
module.exports = geoLocation;
