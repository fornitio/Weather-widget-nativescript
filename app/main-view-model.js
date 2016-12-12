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
    let s = 'Application Log: \n';
    for (let i=1; i<21; i++) {
        if (applicationSettings.hasKey('log'+i)) {
            s += applicationSettings.getString('log'+i)
        } else {break}; 
    }

    viewModel.set("tv", "Switch the network refreshing:"); 

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


    viewModel.onTapSw = function() {
        settings.sw = !viewModel.sw;
        applicationSettings.setString('settings', JSON.stringify(settings));
        //toast(applicationSettings.getString('settings'));
    }

    return viewModel;
}

exports.createViewModel = createViewModel;