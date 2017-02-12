'use strict';
const applicationSettings = require("application-settings");
const Observable = require("data/observable").Observable;
const app = require ('application');
const switchModule = require("ui/switch");
const mySwitch = new switchModule.Switch();
const textFieldModule = require("ui/text-field");
const textField = new textFieldModule.TextField();

let settings = {};
applicationSettings.hasKey('settings') ? settings = JSON.parse(applicationSettings.getString('settings')) : settings = {};


function toast(...args) {
    const Toast = require("nativescript-toast");
    const toast = Toast.makeText(args.join(' '));
    toast.show();
}

function createViewModel() {
    const viewModel = new Observable();
    const DEF_LOCATION = require('./utils/constants').DEF_LOCATION || {};

    let settings = {};
    applicationSettings.hasKey('settings') 
        ? settings = JSON.parse(applicationSettings.getString('settings')) 
        : settings = {};
    

    let s = 'Application Log: \n';
    for (let i=1; i<21; i++) {
        if (applicationSettings.hasKey('log'+i)) {
            s += applicationSettings.getString('log'+i)
        } else {break}; 
    }

    viewModel.set("tv", "Switch the GPS refreshing:");
    viewModel.set("lat", settings.lat || DEF_LOCATION.lat || 1); 
    viewModel.set("lon", settings.lon || DEF_LOCATION.lon || 1); 
   
    viewModel.addEventListener(Observable.propertyChangeEvent, function (pcd) {
        //console.log(pcd.eventName.toString() + " " + pcd.propertyName.toString() + " " + pcd.value.toString(), '--', typeof pcd.value);
        const canBeSaved = pcd.eventName.toString() === 'propertyChange' 
                            && ( (pcd.propertyName.toString() === 'lat') || (pcd.propertyName.toString() === 'lon') )
                            && !isNaN(+pcd.value)
                            && pcd.value != 0;
        if (canBeSaved) {
            if (pcd.propertyName.toString() === 'lat') {
                (+pcd.value > 90) ? pcd.value = 90 : (+pcd.value < -90) ? pcd.value = -90 : null;  
            }
            if (pcd.propertyName.toString() === 'lon') {
                (+pcd.value > 180) ? pcd.value = 180 : (+pcd.value < -180) ? pcd.value = -180 : null;  
            }
            settings[pcd.propertyName.toString()] = +pcd.value;
            applicationSettings.setString('settings', JSON.stringify(settings));
        } else {
            viewModel.set("lat", settings.lat || DEF_LOCATION.lat || 1); 
            viewModel.set("lon", settings.lon || DEF_LOCATION.lon || 1);
        }
        console.log(Observable.propertyChangeEvent, 'set:', JSON.stringify(settings));

    });

    viewModel.set('message', s);    
    let messageOptions = {
        sourceProperty: "refreshTime",
        targetProperty: "text"
    }
    textField.bind(messageOptions, viewModel);
    
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

        //toast(applicationSettings.getString('settings'));
    }

    return viewModel;
}

exports.createViewModel = createViewModel;