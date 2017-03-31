
const getForecast = (fetch, uri, config) => 
    location => {
        const serialize = forecast => forecast ? {
            city : forecast.name,
            country : forecast.sys.country,
            date : (forecast.dt+'000'), 
            tHigh : Math.round(forecast.main.temp_max),
            tLow : Math.round(forecast.main.temp_min),
            weather : forecast.weather,
            temp : Math.round(forecast.main.temp),
            coord : forecast.coord
        } : undefined;
        
        const weather = new Promise(function(res,rej){
            fetch(encodeURI(uri(location)), config)
                .then(result => {
                    var parsedBody = JSON.parse(result._bodyInit); 
                    return parsedBody;
                })
                .then(result => {
                    if (!result || !result.main || !isFinite(result.main.temp)) { 
                        rej(JSON.stringify(result)) 
                    }
                    res(serialize(result));
                })
                .catch(e => {rej(e)});       
        });
        return weather;
    }
module.exports = getForecast;
