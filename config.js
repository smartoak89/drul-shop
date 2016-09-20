var config = {
	"port": "3000",
	"gid": "",
	"uid": "",
	"protocol": "http",
	"layouts": {
		"default": "taracot_default",
		"avail": [
			"taracot_default"
		]
	},
	"locales": {
		"dev_mode": true,
		"detect_from_subdomain": true,
		"detect_from_query": false,
		"detect_from_cookie": false,
		"avail": [
			"en",
			"ru"
		]
	},
	"dir": {
		"storage": "../public/files",
		"storage_url": "/files",
		"avatars": "../public/images/avatars",
		"tmp": "../tmp"
	},
	"cookie": {
		"secret": "WsZm4grNOtuyD1Szx8LBpNsT3qj1qX81",
		"domain": "",
		"prefix": "taracotjs_locale_",
		"httpOnly": false,
		"secure": false,
		"maxAge": null,
		"path": "/"
	},
	"session": {
		"secret": "nFX7s8PQrRJKWJLPEzE38Sl9L6kPvAeo",
		"name": "taracotjs_session",
		"rolling": false,
		"resave": false,
		"proxy": true,
		"saveUninitialized": true,
		"unset": "destroy"
	},
	"salt": "fNxkP2eMPdkRsHXx8kPktIEOQlbbf5n9AExkG20AQxMPTtb17QPcVYL6jMU4gbzi",
	"redis": {
		"active": true,
		"host": "localhost",
		"port": 6379,
		"prefix": "taracotjs_",
		"password": ""
	},
	"mailer": {
		"sender": "TaracotJS <noreply@taracot.org>",
		"feedback": "TaracotJS <info@taracot.org>",
		"transport": "sendmail",
		"sendmail": {
			"path": "/usr/sbin/sendmail"
		},
		"smtp": {
			"service": "Gmail",
			"auth": {
				"user": "gmail.user@gmail.com",
				"pass": "password"
			}
		}
	},
	"mongo": {
		"url": "mongodb://localhost/taracotjs",
		"options": {
			"server": {
				"auto_reconnect": false,
				"poolSize": 10,
				"socketOptions": {
					"keepAlive": 1
				}
			},
			"db": {
				"numberOfRetries": 10,
				"retryMiliSeconds": 1000
			}
		}
	},
	"captcha": "captcha_native",
	"graphicsmagick": false,
	"max_upload_file_mb": 100,
	"max_upload_image_mb": 5,
	"max_edit_file_kb": 1024,
	"log": {
		"console": {
			"level": "info",
			"colorize": true
		},
		"file": {
			"level": "error",
			"filename": "../logs/taracotjs.log",
			"json": true,
			"maxsize": 1048576,
			"maxFiles": 3
		},
		"stack": true
	}
};

module.exports = config;