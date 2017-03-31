const c = require('../utils/constants');
const preDefined = {};
preDefined._bodyInit = `{
	"coord":{"lon":36.4,"lat":50},
	"weather":[{"id":800,"main":"Clear","description":"чисте небо","icon":"01d"}],
	"base":"stations",
	"main":{"temp":12,"pressure":1018,"humidity":34,"temp_min":12,"temp_max":12},
	"visibility":10000,
	"wind":{"speed":8,"deg":120},
	"clouds":{"all":0},
	"dt":1489143600,
	"sys":{"type":1,"id":7355,"message":0.0032,"country":"UA","sunrise":1489118268,"sunset":1489159925},
	"id":703706,"name":"Kulynychi","cod":200}`;
const expectedObj = { 
	city: 'Kulynychi', 
	country: 'UA', 
	date: 1489143600+'000', 
	tHigh: 12, 
	tLow: 12, 
	weather: [{ id: 800, main: 'Clear', description: 'чисте небо', icon: '01d' }], 
	temp: 12, 
	coord: { lon: 36.4, lat: 50 } };

describe("GET FORECAST TESTS", function() {
	const getForecast = require('../services/getForecast');

  	it("getForecast must return a Promise", function() {
  		expect(getForecast()() instanceof Promise).toBe(true);
  	});

  	it("getForecast must return a proper object", function(done) {
	  		getForecast( function() {return Promise.resolve( preDefined )}, c.URI, {} )
	  		(c.DEF_LOCATION)
	  			.then( (receivedObj)=>{
			  		expect( JSON.stringify(receivedObj) ).toEqual( JSON.stringify(expectedObj) );
			  	  	done();
  				});
  	});

  	it("getForecast must return an error", function(done) {
	  		getForecast( function() {return Promise.reject( Error( 'Fetch error' ) )}, c.URI, {} )
  			(c.DEF_LOCATION)
	  			.catch( (e)=>{
			  		expect( e.message ).toEqual('Fetch error');
			  	  	done();
  				});
  	});
});

describe("MAIN MODULE TEST", function() {
	const m = require('../utils/main');
	let predefinedObj = {temp:100};
	let appSettings = {};
	let result;
	let mockPermissions = {};	
	let log;
	let loc = {};
	let forecast;
	let main;

	beforeEach(() => {
		main = m();
		appSettings.hasKey = a=>!!appSettings[a];
		appSettings.getString = a=>appSettings[a];
		appSettings.setString = (a,b)=>{appSettings[a]=b};
	});
	afterEach(()=>{
		forecast = undefined;
		loc = {};
		log = undefined;
		appSettings = {};
		result = undefined;
		predefinedObj = {temp:100};
		mockPermissions = {};
	});

	it("result's value must be undefined", function() {
    	expect(result).toBe(undefined);
	});

	it("Must return geolocation object (permissions have been already granteg)", function(done) {
		forecast = (...args) => {
			expect(JSON.stringify(args[0]))
				.toEqual(JSON.stringify({'latitude': 1000, 'longitude': 2000}));
			done();
		};
		loc.getCurrent = () => Promise.resolve({'latitude' : 1000, 'longitude' : 2000});
		mockPermissions.hasPermission = () => true;
		appSettings.setString('settings', JSON.stringify({sw: true}));
		main(r=>r, loc, forecast, n=>n, appSettings, t=>t, l=>l, c, mockPermissions);
	});

	it("Must return geolocation object (permissions granteg by request)", function(done) {
		forecast = (...args) => {
			expect(JSON.stringify(args[0]))
				.toEqual(JSON.stringify({'latitude': 1000, 'longitude': 2000}));
			done();
		};
		loc.getCurrent = () => Promise.resolve({'latitude' : 1000, 'longitude' : 2000});
		mockPermissions.hasPermission = () => false;
		mockPermissions.requestPermission = () => Promise.resolve(true);
		appSettings.setString('settings', JSON.stringify({sw: true}));
		main(r=>r, loc, forecast, n=>n, appSettings, t=>t, l=>l, c, mockPermissions);
	});

	it("Must return default geolocation object (permissions granteg by request)", function(done) {
		forecast = (...args) => {
			expect(JSON.stringify(args[0]))
				.toEqual(JSON.stringify({'latitude': c.DEF_LOCATION.lat, 'longitude': c.DEF_LOCATION.lon}));
			done();
		};
		loc.getCurrent = () => Promise.reject('location haven\'t been received');
		mockPermissions.hasPermission = () => false;
		mockPermissions.requestPermission = () => Promise.resolve(true);
		appSettings.setString('settings', JSON.stringify({sw: true}));
		main(r=>r, loc, forecast, n=>n, appSettings, t=>t, l=>l, c, mockPermissions);
	});

	it("Must return default geoloction object (permissions rejected by request)", function(done) {
		forecast = (...args) => {
			expect(JSON.stringify(args[0]))
				.toEqual(JSON.stringify({'latitude': c.DEF_LOCATION.lat, 'longitude': c.DEF_LOCATION.lon}));
			done();
		};
		loc.getCurrent = () => Promise.resolve({'latitude' : 1000, 'longitude' : 2000});
		mockPermissions.hasPermission = () => false;
		mockPermissions.requestPermission = () => Promise.reject(true);
		appSettings.setString('settings', JSON.stringify({sw: true}));
		main(r=>r, loc, forecast, n=>n, appSettings, t=>t, l=>l, c, mockPermissions);
	});

	it("Must return arguments for refreshViews (permissions rejected by request) getForecast resolved", function(done) {
		rV = (...args) => {
			expect(JSON.stringify(args))
				.toEqual(JSON.stringify([true, predefinedObj]));
			done();
		};
		loc.getCurrent = () => Promise.resolve({'latitude' : 1000, 'longitude' : 2000});
		mockPermissions.hasPermission = () => false;
		mockPermissions.requestPermission = () => Promise.reject(true);
		appSettings.setString('settings', JSON.stringify({sw: true, isVibration: true}));
		forecast = () => Promise.resolve(predefinedObj);
		main(rV, loc, forecast, n=>n, appSettings, t=>t, l=>l, c, mockPermissions);
	});

	it("Must return arguments for refreshViews (permissions rejected by request) getForecast rejected", function(done) {
		rV = (...args) => {
			expect(JSON.stringify(args))
				.toEqual(JSON.stringify([true, predefinedObj]));
			done();
		};
		loc.getCurrent = () => Promise.resolve({'latitude' : 1000, 'longitude' : 2000});
		mockPermissions.hasPermission = () => false;
		mockPermissions.requestPermission = () => Promise.reject(true);
		appSettings.setString('settings', JSON.stringify({sw: true, isVibration: true}));
		appSettings.setString('weather', JSON.stringify(predefinedObj));
		forecast = () => Promise.reject('no forecast.');
		main(rV, loc, forecast, n=>n, appSettings, t=>t, l=>l, c, mockPermissions);
	});
});








