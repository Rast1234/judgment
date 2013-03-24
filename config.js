exports["services"] = {
    "spider" : {
        "id": "spider",
        "url": "ras.arbitr.ru",
        "search": {"Page":1,"Count":2,"GroupByCase":false,"DateFrom":"2000-01-01T00:00:00","DateTo":"2030-01-01T23:59:59","Sides":[],"Judges":[],"Cases":[],"Text":"","InstanceType":"-1"},
        "categories": ["1", "2"],
        "offset": 1000 * 60 * 60 * 24 * 3
    },
    "teacher": {
        "id": "teacher",
        "methods": ["tokenayzer", "cleaner", "bayes"]
    }
},
    
exports["db"] = {
    "host": process.env['DOTCLOUD_DB_MONGODB_HOST'] || 'localhost',
    "port": +(process.env['DOTCLOUD_DB_MONGODB_PORT'] ||  27017),
    "user": process.env['DOTCLOUD_DB_MONGODB_LOGIN'] || undefined,
    "pass": process.env['DOTCLOUD_DB_MONGODB_PASSWORD'] || undefined   
};

