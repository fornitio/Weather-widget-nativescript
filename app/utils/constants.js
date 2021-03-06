module.exports = {
    DEF_ICON : org.nativescript.weatherwidgetnativescript.R.drawable['o01d'],
	DEF_LOCATION : {
		lat : 50, //Kharkiv Location
		lon : 36.4
	},
	URI : (location => "http://api.openweathermap.org/data/2.5/weather"
		+"?lat="+location.latitude
    	+"&lon="+location.longitude
    	+"&units=metric&lang=ua&APPID=22391be6042fa0d7b69ddd3e39549e72"),
	DEF_WEATHER : {
			city : 'Not Connected',
			country : '',
			date : '0',
			tHigh : '--',
			tLow : '--',
			weather : [{icon : '03d'}],
			temp : '273',
		},
	NOTE_ID : 1, //+new Date()
	PENDING_MSG : 'Loading...',
	TEMP_CELSIUS_SIGN : '\u2103',
	TEMP_HIGH_SIGN : '\u2191',
	TEMP_LOW_SIGN : '\u2193',
	TEMP_GAP_SIGN : ' ',
	LOG_LENGTH : 30
}