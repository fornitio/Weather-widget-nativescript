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

describe("getForecast", function() {
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
  			getForecast(c.DEF_LOCATION, function() {return Promise.reject(Error('Fetch error'))})
	  			.catch( (e)=>{
			  		expect( e.message ).toEqual('Fetch error');
			  	  	done();
  				});
  	});
});

describe("MAIN MODULE TEST", function() {
	// main(refreshViews, location, getForecast, note, applicationSettings)
	const main = require('../utils/main')();
	let appSettings = {};
	const predefinedObj = {temp:100};
	beforeEach(()=>{
		appSettings.hasKey = a=>!!appSettings[a];
		appSettings.getString = a=>appSettings[a];
		appSettings.setString = (a,b)=>{appSettings[a]=b};
	});
	afterEach(()=>{
		appSettings = {};
	});

	it("contains spec with an expectation", function() {
    	expect(true).toBe(true);
	});

	it("refreshViews test", function() {
		let x;
		const rV = def => {x = def};
		appSettings.hasKey = ()=>false;
		main(rV, Promise.reject(), Promise.reject(), a=>a, appSettings, b=>b);
    	expect(JSON.stringify(x)).toEqual(JSON.stringify(c.DEF_WEATHER));
	});
	
	it("application-settings test", function() {
		let x;
		const rV = def => {x = def};
		appSettings.setString('weather', JSON.stringify(predefinedObj));
		main(rV, Promise.reject(), Promise.reject(), a=>a, appSettings, b=>b);
    	expect(JSON.stringify(x)).toEqual(JSON.stringify(predefinedObj));
	});

	it("statusbar notification test", function(done) {
		let x;
		const note = (...args) => {
			x = args;
			expect(JSON.stringify(x)).toEqual(JSON.stringify([c.NOTE_ID+2, 'No connection', predefinedObj, c.DEF_ICON, true]));
			done()
		};
		const loc = Promise.resolve({'latitude' : c.DEF_LOCATION.lat, 
                                    'longitude' : c.DEF_LOCATION.lon
                                });
		const forecast = Promise.reject(predefinedObj);
		
		appSettings.hasKey = ()=>false;
		main(a=>{}, loc, ()=>forecast, note, appSettings, b=>b);
			
	});
});








