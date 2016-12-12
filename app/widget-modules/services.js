function toast(...args) {
    const Toast = require("nativescript-toast");
    const msg = args.join(' ');
    let tst = Toast.makeText(msg);
    tst.show();
}
exports.toast = toast;

function geoLocation() {
    var geolocation = require('nativescript-geolocation');
    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }
    console.log(geolocation.isEnabled() ? 'Geolocation enabled' : 'Geolocation disabled');
    return geolocation.getCurrentLocation({ desiredAccuracy: 3, 
        updateDistance: 0.1, 
        maximumAge: 20000, 
        timeout: 20000 });
}
exports.geoLocation = geoLocation;

function getWeather (loc) {
    const config = {
        method : 'GET',
        mode : 'cors'
    }
    const def = {};
    const weather = new Promise(function(res,rej){
        res(loc);
    })
    .then((location)=>{
        var uri = 'http://api.openweathermap.org/data/2.5/weather?lat='
        +location.latitude
        +'&lon='
        +location.longitude
        +'&units=metric&lang=ua'
        +'&APPID=22391be6042fa0d7b69ddd3e39549e72';
        return fetch(encodeURI(uri), config)
    })
    .then(res => {
        var j = JSON.parse(res._bodyInit); 
        return j;
        //console.log('received: ', res._bodyInit.coord);
    })
    return weather;

}
exports.getWeather = getWeather;

function notifications () {
    var utils = require("utils/utils");
    var context = utils.ad.getApplicationContext();
    var manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    var intent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);
    var pI = android.app.PendingIntent.getActivity(context,
       1,
       intent,
       android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    return function(id, title, body, icon) {
        var builder = new android.app.Notification.Builder(context);
        builder.setContentIntent(pI);
        builder.setContentTitle(title)
            .setAutoCancel(true)
            .setContentText(body)
            .setVibrate([100, 200, 100]) // optional
            .setSmallIcon(icon);              
        manager.notify(id, builder.build());
    } 
}
exports.notifications = notifications;


