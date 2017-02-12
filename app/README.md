The simple weather widget.
Progect structure:
app
|-widget
|--myWidget.js
|--myWidgetClass.js
|-main
|--main-view.js
|--main-view.html
|--main-view-model.js
|-utils
|--utilities.js
|-service
|--geolocation.js
|--network.js
|-app.js

GeoLocation
- require('nativescript-geolocation');
- function checkEnabled // request permissions and enable
- function getCoordinates

Newtwork
- function getWhether
- function ....