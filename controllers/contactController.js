
const Contact = require("../model/Contact");

//Get all Contacts
const getAllContacts = async (req, res) => {
   const contacts = await Contact.find().sort({LastName: 1});
   if(!contacts || contacts.length == 0){return res.status(400).json({message: "No Contacts found."})}

   res.json(contacts);
};

//Create a Contact
const createNewContact = async (req, res) => {

  try{
    const result = await Contact.create ({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Phone: req.body.Phone,
      Email: req.body.Email,
      Address: req.body.Address,
    });
    res.redirect("/?s=0");
  }
  catch(err)
  {
    console.log(err);
  }
};

//Update a Contact
const updateContact = async (req, res) => {

  if(!req.body.id) {
    return res.status(400).json({message: "Id paramater is required"});
  }

  const contact = await Contact.findOne({_id: req.body.id});

  if (!contact) {
    return res
      .status(400)
      .json({ message: `Contact ${req.body.id} is not found` });
  }

  var somethingHasChanged = false;

  if (req.body.FirstName != contact.FirstName)
  {
    contact.FirstName = req.body.FirstName;
    somethingHasChanged = true;
  }

  if (req.body.LastName != contact.LastName)
  {
    contact.LastName = req.body.LastName;
    somethingHasChanged = true;
  }

  if (req.body.Phone != contact.Phone)
  {
    contact.Phone = req.body.Phone;
    somethingHasChanged = true;
  }

  if (req.body.Email != contact.Email)
  {
    contact.Email = req.body.Email;
    somethingHasChanged = true;
  }

  if (req.body.Address != contact.Address)
  {
    contact.Address = req.body.Address;
    somethingHasChanged = true;
  }

  if(somethingHasChanged)
  {
    const result = await contact.save();
    res.redirect("/?s=1");
  }
  else
  {
    res.redirect("/");
  }
};

//Delete a Contact
const deleteContact = async (req, res) => {
  
  if(!req.body.id) {
    return res.status(400).json({message: "Id paramater is required"});
  }

  const contact = await Contact.findOne({_id: req.body.id});

  if (!contact) {
    return res
      .status(400)
      .json({ message: `Contact ${req.body.id} is not found` });
  }
  
  const result = await contact.deleteOne({_id: req.body.id});

  res.redirect("/?s=2");
};

//Get a Contact
const getContact = async (req, res) => {
  if(!req.params.id){return res.status(400).json({message: "Contact Id is required"})}
  const contact = await Contact.findOne({_id: req.params.id});

  if (!contact) {
    return res
      .status(204)
      .json({ message: `Contact with ID of ${req.params.id} is not found` });
  }
  res.json(contact);
};

module.exports = {
  getAllContacts,
  createNewContact,
  updateContact,
  deleteContact,
  getContact,
};
