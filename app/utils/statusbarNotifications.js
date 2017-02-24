function notifications () {
    let utils = require("utils/utils");
    let context = utils.ad.getApplicationContext();
    let manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    let intent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);
    let pI = android.app.PendingIntent.getActivity(context,
       1,
       intent,
       android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    return function(id, title, body, icon) {
        let builder = new android.app.Notification.Builder(context);
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