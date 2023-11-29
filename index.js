const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));
app.get('/',(req,res)=>{
  res.send('<a href="http://localhost:8000/a" style="font-size:70px;">Go to contact list</a>')
})


var contactList = [];


// <--R--> Read Data from Database and Browser
app.get('/a', function(req, res) {
  Contact.find({})
      .then(contacts => {
          res.render('home', {
              title: "Contact List",
              contact_list: contacts
          });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send("Error retrieving contacts");
      });
});

    // <--C--> Add data from Database and Browser
app.post('/create-contact', function(req, res){
    // contactList.push(req.body);
    // return res.redirect('back');

    Contact.create({
      name: req.body.name,
      phone: req.body.phone
  })
  .then(newContact => {
      console.log('New contact created:', newContact);
      res.redirect('back');
  })
  .catch(err => {
      console.error('Error in creating a contact:', err);
      res.status(500).send('Error creating a contact');
  });
});

// <--D--> Delete contact from database and browser
app.get('/delete-contact/', function(req, res){
    let id = req.query.id

    Contact.findByIdAndDelete(id)
        .then(deletedContact => {
            if (!deletedContact) {
                console.log("Contact not found");
                return res.redirect('back');
            }
            console.log('Deleted contact:', deletedContact);
            return res.redirect('back');
        })
        .catch(err => {
            console.error('Error deleting contact:', err);
            return res.status(500).send('Error deleting contact');
        });
});





app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})