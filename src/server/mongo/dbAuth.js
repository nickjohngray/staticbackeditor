const {clientConnect, clientClose} = require('./dbMongo')

module.exports = {
    /*
     * Authentication: Get Signed In User Data
     * Inputs: username
     */
    getSignInUser: async (username) =>
        await (() =>
            new Promise((resolve, reject) =>
                clientConnect().then((client) => {
                    //go ahead and make the query...
                    client
                        .db('database_name')
                        .collection('users')
                        .find({
                            username: username
                        })
                        .limit(1)
                        .toArray((err, data) => {
                            //validation would go here...

                            clientClose(client)
                            resolve(data[0])
                        })
                })
            ))
}
