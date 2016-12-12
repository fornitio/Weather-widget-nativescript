'use strict';
require("./bundle-config");
const application = require("application");

 application.android.on(application.AndroidApplication.activityBackPressedEvent, function (args) {
    	console.log("Event: " + args.eventName + ", Activity: " + args.activity);
        // Set args.cancel = true to cancel back navigation and do something custom.
    });

application.start({ moduleName: "main-page" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
