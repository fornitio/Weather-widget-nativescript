const notifications = () => {
    const utils = require("utils/utils");
    const context = utils.ad.getApplicationContext();
    const manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    const intent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);
    const pI = android.app.PendingIntent.getActivity(context,
       1,
       intent,
       android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    return function(id, title, body, icon, isVibration) {
        const builder = new android.app.Notification.Builder(context);
        builder.setContentIntent(pI);
        builder.setContentTitle(title)
            .setAutoCancel(true)
            .setContentText(body)
            .setVibrate(isVibration ? [100, 200, 100] : [0, 0, 0]) // optional
            .setSmallIcon(icon);              
        manager.notify(id, builder.build());
    } 
}
module.exports = notifications;