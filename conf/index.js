module.exports = {
    "port" : "8088",
    "live": false,
    "session": {
        "secret": "SomeThink",
        "key": "sid",
        "coockie": {
            "path": "/",
            "httpOnly": true
        }
    },
    "mongoose": {
        "uri": "mongodb://localhost/test"
    }
};