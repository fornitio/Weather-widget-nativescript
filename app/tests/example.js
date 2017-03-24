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

// A sample Jasmine test
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("GET FORECAST TESTS", function() {
	const getForecast = require('../services/getForecast');

  	it("getForecast must return a Promise", function() {
  		expect(getForecast() instanceof Promise).toBe(true);
  	});

  	it("getForecast must return a proper object", function(done) {
	  		getForecast(c.DEF_LOCATION, function() {return Promise.resolve( preDefined )})
	  			.then( (receivedObj)=>{
			  		expect( JSON.stringify(receivedObj) ).toEqual( JSON.stringify(expectedObj) );
			  	  	done();
  				});
  	});

  	it("getForecast must return an error", function(done) {
  			getForecast(c.DEF_LOCATION, function() {return Promise.reject( Error( 'Fetch error' ) )})
	  			.catch( (e)=>{
			  		expect( e.message ).toEqual('Fetch error');
			  	  	done();
  				});
  	});
});

describe("MAIN MODULE TEST", function() {
	// main(refreshViews, location, getForecast, note, applicationSettings, toast)
	const main = require('../utils/main')();
	let predefinedObj = {temp:100};
	let appSettings = {};
	let result;
	
	beforeEach(() => {
		appSettings.hasKey = a=>!!appSettings[a];
		appSettings.getString = a=>appSettings[a];
		appSettings.setString = (a,b)=>{appSettings[a]=b};
	});
	afterEach(()=>{
		appSettings = {};
		result = undefined;
		predefinedObj = {temp:100};
	});

	it("result's value must be undefined", function() {
    	expect(result).toBe(undefined);
	});

/*	it("refreshViews must get default value", function() {
		const rV = def => {result = def};
		appSettings.hasKey = ()=>false;
		main(rV, Promise.reject(), Promise.reject(), a=>a, appSettings, b=>b);
    	expect(JSON.stringify(result)).toEqual(JSON.stringify(c.DEF_WEATHER));
	});
	
	it("refreshViews must get predefined value", function(done) {
		const refreshViews = def => {
    		expect(JSON.stringify(def)).toEqual(JSON.stringify(true));
    		done();
		};
		const getForecast = Promise.reject();
		appSettings.setString('weather', JSON.stringify(predefinedObj));
		main(refreshViews, Promise.reject(), getForecast, a=>a, appSettings, b=>b);
	});

	it("[getForecast catch] statusbar notification must get 'no connection' array", function(done) {
		const e = 'getForecast error';
		const message = [c.NOTE_ID+2, 'No connection', e, c.DEF_ICON, true];
		const note = (...args) => {
			expect(JSON.stringify(args)).toEqual(JSON.stringify(message));
			done()
		};
		const loc = Promise.resolve({'latitude' : c.DEF_LOCATION.lat, 
                                    'longitude' : c.DEF_LOCATION.lon
                                });
		const forecast = Promise.reject(e);
		appSettings.hasKey = ()=>false;
		main(a=>{}, loc, ()=>forecast, note, appSettings, b=>b);
	});

	it("[getForecast catch] refreshViews must get default weather const", function(done) {
		const refreshViews = (...args) => {
			expect(JSON.stringify(args[0])).toEqual(JSON.stringify(c.DEF_WEATHER));
			done()
		};
		const loc = Promise.resolve({'latitude' : c.DEF_LOCATION.lat, 
                                    'longitude' : c.DEF_LOCATION.lon
                                });
		const forecast = Promise.reject();
		appSettings.hasKey = ()=>false;
		main(refreshViews, loc, ()=>forecast, a=>a, appSettings, b=>b);
	});
	
	it("[getLocation then] toast must get coordinates string", function(done) {
		const coordinatesString = '(50.0, 36.4)';
		const toast = (...args) => {
			expect(args[0]).toEqual(coordinatesString);
			done()
		};
		const loc = Promise.resolve({'latitude' : c.DEF_LOCATION.lat, 
                                    'longitude' : c.DEF_LOCATION.lon
                                });
		const forecast = Promise.resolve();
		appSettings.hasKey = ()=>false;
		main(b=>b, loc, ()=>forecast, a=>a, appSettings, toast);
	});*/
		
	it("[getForecast then] refreshViews must get predefined object", function(done) {
		const refreshViews = (...args) => {
			expect(JSON.stringify(args[0])).toEqual(JSON.stringify(predefinedObj));
			done()
		};
		const loc = Promise.resolve({'latitude' : c.DEF_LOCATION.lat, 
                                    'longitude' : c.DEF_LOCATION.lon
                                });
		const forecast = () => Promise.resolve(predefinedObj);
		appSettings.hasKey = ()=>false;
		main(refreshViews, loc, forecast, a=>a, appSettings, b=>b);
	});

	it("[getForecast catch] refreshViews must get predefined object", function(done) {
		const refreshViews = (...args) => {
			expect(JSON.stringify(args[0])).toEqual(JSON.stringify(predefinedObj));
			done()
		};
		const loc = Promise.resolve({'latitude' : c.DEF_LOCATION.lat, 
                                    'longitude' : c.DEF_LOCATION.lon
                                });
		const forecast = () => Promise.reject(predefinedObj);
		//appSettings.hasKey = ()=>false;
		appSettings.setString('weather', JSON.stringify(predefinedObj));
		main(refreshViews, loc, forecast, a=>a, appSettings, b=>b);
	});

});








