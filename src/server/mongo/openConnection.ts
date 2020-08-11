import {MongoClient} from 'mongodb'

export const openConnection = async ()  => {
    try {
       return await MongoClient.connect('mongodb://localhost:27017/staticback')
    } catch (e) {
        throw (e)
    }
}

export const getUserInfo = async (client , email:string, pwd:string)   =>  {
    try {
        return await
            client.db('staticback')
                .collection('customers')
                .findOne({email, pwd}, {projection: {repo: 1, _id: 0}})
    }catch (e) {
        throw  e
    }
}



