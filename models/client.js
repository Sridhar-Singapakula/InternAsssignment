const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const passwordComplexity = require("joi-password-complexity");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin:{type:Boolean,default:false},
});

clientSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id,name:this.name,isAdmin:this.isAdmin}, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  };

const Client = mongoose.model("Client", clientSchema);

const validate = (client) => {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    password: passwordComplexity().required().label("Password"),
    mobileNo: Joi.string().required().label("Mobile Number"),
    emailId: Joi.string().email().required().label("Email Address"),
  });
  return schema.validate(client);
};

module.exports = { Client, validate };
