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
module.exports = notifications;