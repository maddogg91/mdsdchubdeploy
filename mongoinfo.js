const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const fs = require('fs');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
const user= process.env['USE'];
const pass= process.env['PASS'];
const url= 'mongodb+srv://'+user+':'+pass+'@cluster0.4grai.mongodb.net/';
const client = new MongoClient(url, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
			}
        }
		);
const multer  = require('multer');
const emails= require('./config/email.js')
connect();
const database= client.db("mdgportal");
const users= database.collection("users");
const requests= database.collection("requests");
const archived= database.collection("archivedreq");
const trashedNotification= database.collection("archnotif")
const notifications= database.collection("notifications");
const verifications= database.collection("verify")
trashedNotification.createIndex({ date: 1 }, { expireAfterSeconds: 2592000 });
archived.createIndex({ date: 1 }, { expireAfterSeconds: 2592000 });
verifications.createIndex({ date: 1 }, { expireAfterSeconds: 1800});

async function connect(){
	try {
		await client.connect();
	}
	 catch (error) {
       console.log(error);
    }
}


function enc(txt){

return  CryptoJS.AES.encrypt(txt, 'mdg').toString();
}

// Legacy decrypt, kept only to verify passwords stored before the bcrypt migration.
function dec(data){
  const bytes = CryptoJS.AES.decrypt(data, 'mdg');
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function isBcryptHash(value){
  return typeof value === 'string' && /^\$2[aby]?\$/.test(value);
}

async function hashPassword(pass){
  return bcrypt.hash(pass, 12);
}

async function register(email,pass, name, country, bday, phone){
	const new_user= {
		email: email,
		passw: await hashPassword(pass),
    name: name,
    country: country,
    bday: bday,
    usertype: "customer",      url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
		joindate: new Date().toLocaleString(),
    phone: phone,
    verified: false
	}
	const user= await users.findOne({email: new_user.email});
	console.log(user);
	if(!user){
		users.insertOne(new_user);
    const ver= {
      _id: Math.floor(Math.random()*90000) + 10000,
      email: new_user.email,
      date: new Date().toLocaleString()
    }
    verifications.insertOne(ver);
    emails.emailRegistrationCode(ver);
		return user;
	}
	else{
		console.log("Username exists");
		return false;
	}
}
async function createWebSiteRequest(user, body, type){
  var pgcount;
  var updates;
  switch (body.package){
    case "1":
        body.pagecount= 3
        body.updates= 0
        break;
    case "2":
        body.pagecount= 5
        body.updates= 1
        break;
    case "3":
        body.pagecount= 8
        body.updates= 3
        break;
    
  }
  const new_request= {
    user: user,
    request: body,
    creationdate: new Date().toLocaleString(),
    status: 'initiate',
    type: type,
    balance: body.total
  }
  requests.insertOne(new_request);
}

async function loadRequest(user){
 
  const req= await requests.find({'user._id': user._id.toString()}).toArray(function(err, result) {
    if (err) throw err;
     });

  if(req!= null){
   
    return req;
  }
  return null;
}
async function loadUser(user){

  const req= await users.findOne({'_id': new ObjectID(user._id)});

  if(req!= null){

    return req;
  }
  return null;
}
async function loadNotifications(user){
  
  var filter= "";
  if(user.usertype== "Admin"){
    filter= {'user': "Admin"};
  }
  else{
    filter= {'user': user._id};
  }

  const notif= await notifications.find(filter).toArray(function(err, result) {
    
    if (err) throw err;
     });
  
  return notif;
}
function notificationOwnerFilter(user){
  return user.usertype== "Admin" ? {'user': "Admin"} : {'user': user._id};
}

async function updateNotification(body, user){
  const filter= Object.assign({'_id': new ObjectID(body._id)}, notificationOwnerFilter(user));
  const result= await notifications.updateOne(filter, {$set: {'isRead': true}});
  return result.matchedCount > 0;
}
async function deleteNotification(body, user){
  const filter= Object.assign({'_id': new ObjectID(body._id)}, notificationOwnerFilter(user));
  const doc= await notifications.findOne(filter);
  if(!doc){
    return false;
  }
  trashedNotification.insertOne(doc);
  await notifications.deleteOne(filter);
  return true;
}
async function loadArchived(body, user){
  const archivedData= {
     'data': ' ',
     'type': ' '
   }
  switch(body){
     
     
     case 'notifications':
   
      var filter= "";
      if(user.usertype== "Admin"){
        filter= {'user': "Admin"};
      }
      else{
        filter= {'user': user._id};
      }
     
      archivedData.data= await trashedNotification.find(filter).toArray(function(err, result) {
       
        if (err) throw err;
       
         });
      
      archivedData.type="notification";
       return archivedData;

      case 'projects':
      filter = {'user._id': user._id}
       archivedData.data= archived.find(filter).toArray(function(err, result) {

        if (err) throw err;
       
         });
      archivedData.type="project";
       return archivedData;
   }
}

async function restore(body, type, user){
  const restore= []
  switch(type){
    case 'notification':
      restore.push(body.forEach((item=> lookup(item, trashedNotification) 
        )));
      break;
    case 'project':
      restore.push();
      break;
  
  }
  console.log(restore);
}

async function lookUp(item, source){
  const lookup= await source.findOne({'_id': new ObjectID(item)});
  return lookup;
}

async function login(email,pass){
	const user= await users.findOne({email: email});
	if(user== null){
		return null;
	}

	if(isBcryptHash(user.passw)){
		const match= await bcrypt.compare(pass, user.passw);
		return match ? user : null;
	}

	// Legacy AES-encrypted password: verify against it, then migrate to bcrypt on success.
	if(dec(user.passw) === pass){
		const newHash= await hashPassword(pass);
		await users.updateOne({'_id': new ObjectID(user._id)}, {$set:{passw: newHash}});
		user.passw= newHash;
		return user;
	}
	return null;
}
async function reset(email,pass){
  const user= await users.findOne({email: email});
  if(user!= null){
  user.passw= await hashPassword(pass);
  users.updateOne({'_id': new ObjectID(user._id)}, {$set:{passw: user.passw}})
  }
}
async function notifyUpdate(header, user, notification){
  var body={
    header: header,
    user: user,
    notification: notification,
    date: new Date().toLocaleString(),
    isRead: false
  }
  notifications.insertOne(body);
}

async function updateRequest(req, user){
  // balance is intentionally excluded here: it must only ever change via
  // makeFullPayment (a verified Stripe payment), never a client-supplied value.
  const result= await requests.updateOne(
    {'_id': new ObjectID(req._id), 'user._id': user._id.toString()},
    {$set: {request: req.request}}
  );
  return result.matchedCount > 0;
}

async function deleteProject(req, user){
  const owned= await requests.findOne({'_id': new ObjectID(req._id), 'user._id': user._id.toString()});
  if(!owned){
    return false;
  }
  archived.insertOne(owned);
  await requests.deleteOne({'_id': new ObjectID(req._id)});
  return true;
}

async function getRequestForPayment(id, user){
  return requests.findOne({'_id': new ObjectID(id), 'user._id': user._id.toString()});
}

async function updateProfile(us, body, path){

  us.name= body.name;
  us.email= body.email;
  if(body.passwordFlag){
    us.passw= await hashPassword(body.passw);
  }
  // else: leave the existing hash untouched, previously this branch overwrote
  // it with the raw (often empty) form field.

  us.phone= body.phone;
  const query= {name: us.name, email: us.email, passw: us.passw, phone: us.phone}

  users.updateOne({'_id': new ObjectID(us._id)}, {$set:query})
}

function updateUserAvatar(path, user){
  var p= path.replace("public/","");
  users.updateOne({'_id': new ObjectID(user._id)}, {$set:{avatar: p}});
}
async function createResetToken(email){
  const ver= {
    _id: Math.floor(Math.random()*9000000) + 1000000,
    email: email,
    date: new Date()
  }
  verifications.insertOne(ver);
  emails.resetPassword(ver);
}

async function resetPassword(request){
  const tmp= await verifications.findOne({'_id': parseInt(request.code)})
  console.log(tmp);
  if(tmp!= null){
    users.updateOne({'email': tmp.email}, {$set:{passw: await hashPassword(request.password)}});
    verifications.deleteOne({'_id': parseInt(request.code)});
    return true;
  }
  else{
    return false;
  }
}


async function verify(code){
  var vfy= ''
  code.forEach((c) => {
    vfy= vfy + c
  });

  const tmp= await verifications.findOne({'_id': parseInt(vfy)});

  
  if(tmp){
    const user= await users.findOne({'email': tmp.email })
   
    users.updateOne({'_id': new ObjectID(user._id)}, {$set:{verified: true}});

    verifications.deleteOne({'_id': tmp._id});
    
      return true;
    }
  else{
    return false;
  }
  }

function makeFullPayment(id){
  requests.updateOne({'_id': new ObjectID(id)}, {$set: {balance: 0}});
}

async function resendVerification(email){
  const user= await users.findOne({email: email});

  if(user){
    verifications.deleteOne({'email': email});
    const verification= Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const body={
        email: email,
        code: verification,
        date: new Date()
      }
      verifications.insertOne(body);
      emails.emailRegistrationCode(body);
    }
  return user;
  }

async function googleAuth(googleUser){
  const profile= googleUser._json;
  const email= profile.email;
  const name= profile.name;
  const image= profile.picture;
  const id= profile.sub;
  const user= await users.findOne({email: email});
  if(user){
    return user;
  }
  else{
    const body={
      name: name,
      email: email,
      avatar: image,
      id: id,
      verified: true,
      usertype: "customer",
      date: new Date()
    }
    users.insertOne(body);
    return body;
  }
}
  
  
  

module.exports = { register, login, loadRequest, createWebSiteRequest, updateRequest, notifyUpdate, loadNotifications, deleteProject, updateProfile, reset, updateUserAvatar, loadUser, loadArchived, updateNotification, deleteNotification, verify, makeFullPayment, resendVerification, createResetToken, resetPassword, googleAuth, getRequestForPayment};
