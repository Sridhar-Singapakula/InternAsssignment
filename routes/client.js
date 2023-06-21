const router = require("express").Router();
const bcrypt = require("bcrypt");
const validObjectId = require("../middleware/validateObjectId");
const { validate, Client } = require("../models/client");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

// Create a new client
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const client = await Client.findOne({ emailId: req.body.emailId },{ maxTimeMS: 20000 });
  if (client) {
    return res.status(403).send({ message: "Client with given email already exists!" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  let newClient = await new Client({
    ...req.body,
    password: hashPassword,
  }).save();
  
  newClient.password = undefined;
  newClient.__v = undefined;
  res.status(200).send({ data: newClient, message: "Client registered successfully" });
});

// Get all clients
router.get("/", admin, async (req, res) => {
  const clients = await Client.find().select("-password -__v");
  res.status(200).send({ data: clients });
});

// Get a client by Id
router.get("/:id", [validObjectId, auth], async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select("-password -__v");
  
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    res.status(200).send({ data: client });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});





// Update a client by Id
router.put("/:id", [validObjectId, auth,admin], async (req, res) => {
  
    const updatedClient= await Client.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true}).select("-password-__v");
	  res.status(200).send({data:updatedClient,message:"User updated successfully"});
});

// Delete a client by Id
router.delete("/:id", [validObjectId, admin], async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
	res.status(200).send({message:"Successfully deleted the user"})
});





module.exports = router;
