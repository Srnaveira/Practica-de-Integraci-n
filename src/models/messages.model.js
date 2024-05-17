import mongoose from "mongoose";

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true, max: 100},
    message: { type: String, required: true, max: 500 }

});

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;

