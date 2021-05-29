var mongodbsettings = {}


mongodbsettings.mogoosevariable = process.env.mongodb || 'mongodb://localhost:27017/firstNode'


module.exports = mongodbsettings