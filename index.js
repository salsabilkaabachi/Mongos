const express = require('express');
const app = express();
const port =process.env.PORT || 6000
let mongoose = require('mongoose');

//importation dotenv module
require('dotenv').config()

// connecting to database
mongoose
  .connect("mongodb://localhost:27017/people", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(()=> console.log("Database connection successful")) 
    .catch((err)=>console.error("Failed to connect to Database"));


//creating person schema
const Schema = mongoose.Schema;
const personSchema = new Schema({
  name: { type: String, required: true },
  age: {type:Number},
  favoriteFoods:{type: [String]},
  title: String, // String is shorthand for {type: String}
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});
//Creating model 
const Person = mongoose.model("Person", personSchema);

//Create and Save a Record of a Model:


 const salabilkaa = new Person({
    id :1 ,
    name: "salsabil kaa",
    age: 25,
    favoriteFoods: ["pizza", "tacos"],
  });

  salsabilkaa.save((err) => {
    if (err) return console.error(err);
  
  });

  
  



//Create Many Records with model.create():

  Person.create(Users, (err,people)=>{
    if (err) return console.log(err);
  });

  //Use model.find() to Search Your Database


  /***********afficher all***********/
  app.get('/users', function(req, res) {    
    Person.find({}, function (err, Person) {
        res.send(Person);
    });
});
app.post('/Find-by-name', function (req, res) {
  var Name = req.body.name;


  Person.find({name: Name},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});

/**************findOne****************/

  app.post('/Find-One', function (req, res) {
  var favfood = req.body.favoriteFoods;


  Person.findOne({favoriteFoods: favfood},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});
/***************findById***********/
app.get('/Find-By-Id', function (req, res){
var personId = req.body._id;
 Person.findById({_id: personId},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});

/******************Perform Classic Updates by Running Find, Edit, then Save**************************/

app.put('/Find-Edit', function (req, res){
const personId = req.body._id;
 const foodToAdd = "hamburger";

 Person.findById({_id: personId})

 .then((result) => {
     console.log(res)
 result.favoriteFoods.push(foodToAdd)
 console.log('your favouriteFoods is updated successfully')
      result.save()
      res.send(result)

      })
      .catch((err) => console.log(err))

})


/**********Perform New Updates on a Document Using model.findOneAndUpdate()**************/

app.put('/FindOne-Update', function (req, res){


var personName = req.body.name;
var ageToSet = 20;
 Person.findOneAndUpdate(
   {"name": personName},
    {$set: {"age":ageToSet}},
    {new : true},

    function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  }
)});
/**************delete one *************/
app.delete('/FindById-Remove', function (req, res){
var personId = req.body._id;
 Person.findByIdAndRemove({_id: personId},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});
/*************Deleting many********************/


app.delete('/Find-Remove', function (req, res){
var person_Name = 'Mary'
Person.remove({name: person_Name},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })

});
/***********Chain Search Query Helpers to Narrow Search Results************/
app.post('/FindSort',function (req, res){
const chainSearch = "cheesenaan";
   Person.find({ favoriteFoods: chainSearch })
  .sort({ name: 1 })
  .limit(2)
  .select({age:0})
  .exec((err, Person) =>
    err
      ? next(err)
      : res.send(Person)
  )

})


  // Person.find({ name: 'Aicha' }, (err,res) => {
  //   err ? console.log('Error', err) : console.log(res)
  // });

  

//port
app.listen(port, () => console.log(`server started on port ${port}`));