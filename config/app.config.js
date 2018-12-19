"use strict";
if(process.env.NODE_ENV === 'production'){
   module.exports = {
      port      : process.env.PORT || 3000 ,
      dbURL     : process.env.DB_LINK || "mongodb://5c3054502e98dbdd54ef39cbb055d7c4:1234567899@6a.mongo.evennode.com:27017/5c3054502e98dbdd54ef39cbb055d7c4?replicaSet=eu-6",
      secretKey : 'secret'
    }
}else{
        module.exports = {
            port      : 3001 ,
            dbURL     : 'mongodb://localhost:27017/myrestApp',
            secretKey : 'secret'
        }
}