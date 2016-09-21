module.exports = {
    "port" : "8088",
    "live": false,
    "session": {
        "secret": "SomeThink",
        "key": "sid",
        "coockie": {
            "path": "/",
            "httpOnly": true,
            "maxAge": true
        }
    },
    "mongoose": {
        "uri": "mongodb://localhost/drul-shop"
    }
};