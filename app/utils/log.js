const log = (stdLog) => {
	const applicationSettings = require("application-settings");
	const LOG_LENGTH = require('./constants').LOG_LENGTH;
	return (...args) => {
		const d = new Date();
		const timeStamp = '['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']';
		log.max = (log.max || 0) + 1;
		applicationSettings.setString('log'+log.max, timeStamp+args.join(' ')+'\n');
		stdLog(applicationSettings.getString('log'+log.max));
		if (log.max > LOG_LENGTH) {
			log.max = 0;
			for (let i=1; i<LOG_LENGTH+1; i++) {
				applicationSettings.hasKey('log'+i) ? applicationSettings.remove('log'+i) : null;
			}
		}
	} 
}
module.exports = log;