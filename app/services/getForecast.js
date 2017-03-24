function getForecast (location, fetch) {
    const config = {
        method : 'GET',
        mode : 'cors'
    }
    const weather = new Promise(function(res,rej){
        var uri = 'http://api.openweathermap.org/data/2.5/weather?lat='
            +location.latitude
            +'&lon='
            +location.longitude
            +'&units=metric&lang=ua'
            +'&APPID=22391be6042fa0d7b69ddd3e39549e72';
        fetch(encodeURI(uri), config)
            .then(result => {
                var parsedBody = JSON.parse(result._bodyInit); 
                return parsedBody;
            })
            .then(result => {
                if (!result || !result.main || !isFinite(result.main.temp)) { rej(JSON.stringify(result)) }
                let def = {};
                def.city = result.name;
                def.country = result.sys.country;
                def.date = result.dt+'000';
                console.log('date', Date.now() - def.date);
                def.tHigh = Math.round(result.main.temp_max);
                def.tLow = Math.round(result.main.temp_min);
                def.weather = result.weather;
                def.temp = Math.round(result.main.temp);
                def.coord = result.coord;
                res(def);
            })
            .catch(e => {rej(e)});       
    });
    return weather;
}
module.exports = getForecast;
