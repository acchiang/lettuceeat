const mongoose = require('mongoose')
const Schema = mongoose.Schema
import User from './user-model'

const Session = new Schema(
    {
        name: { type: String, required: true },
        users: { type: [User], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('sessions', Session)