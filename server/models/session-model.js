const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = require("./user-model").schema;

const Session = new Schema(
  {
    _id: String,
    name: { type: String, required: true },
    users: { type: [UserSchema], required: true },
    menuTotalSoFar: { type: Number, required: true },
    tipTotalSoFar: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = {
  model: mongoose.model("sessions", Session),
  schema: Session
};
