const geolocation = () => {
	const application = require('application');
	const observable = require('data/observable');
	const params = {
		locationPriority:100, // 104 - 10km, 102 -100m, 100 -finest 
		locationMaxWaitTime:5000};
	const debug = console.log.bind(console);//require('nativescript-debug')(__filename);

	const GoogleApiClient = com.google.android.gms.common.api.GoogleApiClient;
	const LocationServices = com.google.android.gms.location.LocationServices;
	const LocationRequest = com.google.android.gms.location.LocationRequest;
	const LocationListener = com.google.android.gms.location.LocationListener;

	const service = new observable.Observable();
	service.ready = false;

	service.serialize = function(location) {
	  return location ? {
	    provider: location.getProvider(),
	    timestamp: new Date(location.getTime()),
	    accuracy: location.hasAccuracy() ? location.getAccuracy() : null,
	    latitude: location.getLatitude(),
	    longitude: location.getLongitude(),
	    altitude: location.hasAltitude() ? location.getAltitude() : null,
	    speed: location.hasSpeed() ? location.getSpeed() : null,
	    bearing: location.hasBearing() ? location.getBearing() : null,
	    extras: location.getExtras(),
	  } : null;
	}.bind(service);

	service.initialize = function() {
		console.log('initialize running');
	  this.googleApiClient = new GoogleApiClient.Builder(application.android.context)
	    .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks({
	      onConnected: function() {
	        debug('onConnected', arguments);
	        this.ready = true;
	        this.notify({
	          eventName: 'ready',
	        });
	        this.notify({
	          eventName: '_googleApiClientConnected',
	          object: this.googleApiClient
	        });
	      }.bind(this),
	      onConnectionSuspended: function() {
	        debug('onConnectionSuspended', arguments);
	        this.notify({
	          eventName: '_googleApiClientConnectionSuspended',
	          object: this.googleApiClient
	        });
	      }.bind(this),
	    }))
	    .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener({
	      onConnectionFailed: function() {
	        debug('onConnectionFailed', JSON.stringify(arguments));
	        this.notify({
	          eventName: '_googleApiClientConnectionFailed',
	          object: this.googleApiClient
	        });
	      }.bind(this),
	    }))
	    .addApi(LocationServices.API)
	    .build();

	    this.locationRequest = new LocationRequest();
	    this.locationRequest.setPriority(params.locationPriority);
	    this.locationRequest.setMaxWaitTime(params.locationMaxWaitTime);
	    this.locationRequest.setNumUpdates(1);
	    this.locationRequest.setInterval(1000);
	    this.locationRequest.setFastestInterval(1000);
	    this.locationRequest.setSmallestDisplacement(1);

	    this.locationListener = new LocationListener({
	      onLocationChanged: function onLocationChanged(location) {
	        debug('onLocationChanged', location.toString());
	        var value = this.serialize(location);
	        this.resolve(value);
	      }.bind(this),
	    });
	}.bind(service);

	service.initialize();

	service.connect = function() {
		debug('connect');
		this.googleApiClient.connect();
	}.bind(service);

	service.disconnect = function() {
		debug('disconnect');
		this.googleApiClient.disconnect();
		this.ready = false;
	}.bind(service);

	service.getCurrent = function getCurrent() {
	  return new Promise(function(resolve, reject) {
	    var _getCurrent = function _getCurrent() {
		    this.resolve = resolve.bind(this);
			LocationServices.FusedLocationApi.requestLocationUpdates(this.googleApiClient, this.locationRequest, this.locationListener);
	        this.off('_googleApiClientConnected');
		    setTimeout(()=>{
	    		reject('geoLocation timeout error');
	    	},params.locationMaxWaitTime*10);
	    }.bind(this);
	    if (this.ready) {
	      _getCurrent();
	    } else {
	      this.on('_googleApiClientConnected', _getCurrent);
	    }
	  }.bind(service));
	};	
	return service;	
}
module.exports = geolocation;
