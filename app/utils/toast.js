function toast(...args) {
    const Toast = require("nativescript-toast");
    const msg = args.join(' ');
    let tst = Toast.makeText(msg);
    tst.show();
}
module.exports = toast;
