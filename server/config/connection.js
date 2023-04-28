const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orchard-alley-lifts',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    // process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orchard-alley-lifts',function(){

    //     mongoose.connection.db.dropDatabase();
    // }
);


// process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orchard-alley-lifts',
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }
// );

// process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orchard-alley-lifts',function(){
    
//     mongoose.connection.db.dropDatabase();
// });

module.exports = mongoose.connection;