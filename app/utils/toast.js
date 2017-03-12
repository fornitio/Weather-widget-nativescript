const toast = (...args) => {
    const Toast = require("nativescript-toast");
    const msg = args.join(' ');
    const text = Toast.makeText(msg);
    text.show();
}
module.exports = toast;
