'use strict';
const applicationSettings = require("application-settings");
const Observable = require("data/observable").Observable;
const app = require ('application');
const switchModule = require("ui/switch");
const mySwitch = new switchModule.Switch();
const textFieldModule = require("ui/text-field");
const textField = new textFieldModule.TextField();
const toast = require('./utils/toast');

const DEF_LOCATION = require('./utils/constants').DEF_LOCATION;
const LOG_LENGTH = require('./utils/constants').LOG_LENGTH;

function createViewModel() {
    const viewModel = new Observable();

    //settings initialization
    let settings = applicationSettings.hasKey('settings') 
        ? JSON.parse(applicationSettings.getString('settings')) 
        : {};
    if ( typeof settings !== 'object' ) { settings = {} };

    viewModel.set("tv", "Refreshing from GPS "+(settings.sw ? "on" : "off")+":");
    viewModel.set("lat", settings.lat || DEF_LOCATION.lat); 
    viewModel.set("lon", settings.lon || DEF_LOCATION.lon); 

    //Log-making
    let logString = 'Application Log: \n';
    for (let i=1; i<LOG_LENGTH+1; i++) {
        if (applicationSettings.hasKey('log'+i)) {
            logString += applicationSettings.getString('log'+i)
        } else {break}; 
    }
    viewModel.set('message', logString);    
    const messageOptions = {
        sourceProperty: "refreshTime",
        targetProperty: "text"
    }
    textField.bind(messageOptions, viewModel);
    
    //Refreshing from GPS switch
    viewModel.set("sw", true);
    const swOptions = {
        sourceProperty: "sw",
        targetProperty: "checked"
    };
    mySwitch.bind(swOptions, viewModel);

    applicationSettings.hasKey('settings') ? viewModel.set("sw", settings.sw) : settings.sw = viewModel.sw;
    applicationSettings.setString('settings', JSON.stringify(settings));
    
    viewModel.set("isEditable", !settings.sw);
    viewModel.onTapSw = function() {
        settings.sw = !viewModel.sw;
        applicationSettings.setString('settings', JSON.stringify(settings));
        viewModel.set("isEditable", !settings.sw); 
        viewModel.set("tv", "Refreshing from GPS "+(settings.sw ? "on" : "off")+":");
    }

    //Toast messages Switch
    viewModel.set("isToast", true);
    const toastOptions = {
        sourceProperty: "isToast",
        targetProperty: "checked"
    };
    mySwitch.bind(toastOptions, viewModel);

    applicationSettings.hasKey('settings') ? viewModel.set("isToast", settings.isToast) : settings.isToast = viewModel.isToast;
    applicationSettings.setString('settings', JSON.stringify(settings));

    viewModel.onTapToast = function() {
        settings.isToast = !viewModel.isToast;
        applicationSettings.setString('settings', JSON.stringify(settings)); 
    }

    //Vibration notifications Switch
    viewModel.set("isVibration", true);
    const vibrationOptions = {
        sourceProperty: "isVibration",
        targetProperty: "checked"
    };
    mySwitch.bind(vibrationOptions, viewModel);

    applicationSettings.hasKey('settings') 
        ? viewModel.set("isVibration", settings.isVibration) 
        : settings.isVibration = viewModel.isVibration;
    applicationSettings.setString('settings', JSON.stringify(settings));

    viewModel.onTapVibration = function() {
        settings.isVibration = !viewModel.isVibration;
        applicationSettings.setString('settings', JSON.stringify(settings)); 
    }

    //Coordinates on-the-fly changes listener
    viewModel.addEventListener(Observable.propertyChangeEvent, function CoordinatesCorrectionOnTheFly(pcd) {
        const canBeSaved = pcd.eventName.toString() === 'propertyChange' 
                            && ( (pcd.propertyName.toString() === 'lat') || (pcd.propertyName.toString() === 'lon') )
                            && isFinite(+pcd.value);
        if (canBeSaved) {
            if (pcd.propertyName.toString() === 'lat') {
                (+pcd.value > 90) ? pcd.value = 90 : (+pcd.value < -90) ? pcd.value = -90 : undefined;  
            }
            if (pcd.propertyName.toString() === 'lon') {
                (+pcd.value > 180) ? pcd.value = 180 : (+pcd.value < -180) ? pcd.value = -180 : undefined;  
            }
            settings[pcd.propertyName.toString()] = +pcd.value;
            applicationSettings.setString('settings', JSON.stringify(settings));
        } else {
            viewModel.set("lat", settings.lat || DEF_LOCATION.lat); 
            viewModel.set("lon", settings.lon || DEF_LOCATION.lon);
        }
        console.log(Observable.propertyChangeEvent, 'set:', JSON.stringify(settings));

    });

    return viewModel;
}

exports.createViewModel = createViewModel;