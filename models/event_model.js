import mongoose from "mongoose";
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    date: {
        type: Date
    },
    type: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    },
    unit: {
        type: String,
        default: "USD"
    }
});

const Event = mongoose.model("event", eventSchema);
export default Event;