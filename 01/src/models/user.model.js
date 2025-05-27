import mongoose from "mongoose";

const userCollection = "usuarios"

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    age: Number,
    password: String}, 
    {versionKey: 'version'

})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel

