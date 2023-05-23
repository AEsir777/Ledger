import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

// mongoose schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // TODO: add pattern requirements for password
    password: {
        type: String
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

export default User;