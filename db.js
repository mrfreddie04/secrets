const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

//const uri = "mongodb://localhost:27017/userDB"
//await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}); 
//await mongoose.disconnect();  
//await mongoose.connection.close();

let userModel;

async function connect() {
  await mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}); 
  console.log(`Connected to DB: ${process.env.CONNECTIONSTRING}`);
}

async function disconnect() {
  await mongoose.connection.close();
  console.log("Disconnected from DB")
}

function getUserSchema()
{
  const userSchema = new mongoose.Schema({    
    email: {type: String, required: [true,"Email is required"]},
    password: {type: String, required: [true,"Password is required"]}
  });

  //that would encrypt the entire users collection
  //userSchema.plugin(encrypt,{secret:process.env.SECRET});
  //to encrypt certain fields
  userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']});

  return userSchema;
}

function getUserModel() {
  if(!userModel)
  {
    const userSchema = getUserSchema();

    userModel = mongoose.model("User",userSchema);
  }
  return userModel;  
}

function addUser(userObj) {
  return new Promise(async (resolve,reject)=>{
    const User = getUserModel();
    const user = new User(userObj);
    try {
      await user.validate();
      const newUser = await user.save();
      resolve(newUser);  
    } catch(errors) {
      reject(errors);
    }
  });
}

function loginUser(userObj) {
  return new Promise(async (resolve,reject)=>{
    const User = getUserModel();
    try {
      const user = await User.findOne({email:userObj.email});
      if( user) {
        if(user.password===userObj.password)
          resolve(user);
        else
          reject("Invalid password");
      } else {
        reject("Invalid username");
      }
    } catch(errors) {
      reject(`Unexpected error: ${errors}`);
    }  
  });  
}

module.exports = {
  addUser: addUser,
  loginUser: loginUser,
  connect: connect,
  disconnet: disconnect
};