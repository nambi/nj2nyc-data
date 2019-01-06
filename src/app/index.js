const vorpal = require('vorpal')();
const firebase = require("firebase");
require("firebase/firestore");

main = () => {

vorpal
  .command('foo [tripId] [dayOfService]', 'Outputs "bar".')
  .action(function(args, callback) {
    const tripId = args.tripId;  
    const dayOfService = args.dayOfService;  
    this.log('bar :',tripId);
    callback();
  });

vorpal
  .delimiter('nj2nyc-data$')
  .show();


  firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: ""
  });

 var db = firebase.firestore();
 let dayOfService = "MTH_FRI";
 let fromStationCode = "ABBTNDR"; //QUAD4LL 
 let toStationCode = "PABT"; //PABT
 let startTime = 360;
 let endTime = 390;

 db.settings({
  timestampsInSnapshots: true
  });
  let tripsRef = db.collection("trips");
  let query = tripsRef.where("dayOfService","==",dayOfService)
                      .where("stops."+fromStationCode+".stop","==",true)
                      .where("stops."+toStationCode+".stop","==",true)
                      .where("stops."+fromStationCode+".dTime",">=",startTime)
                      .where("stops."+fromStationCode+".dTime","<=",endTime);
   
 let trips = [];
  query.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        const d = doc.data();
        trips.push(d);
        console.log(doc.id+'-'+JSON.stringify(d));

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
    console.log("No of trips found ",trips.length);

}).catch(function(error) {
  console.log("Error getting cached document:", error);
});

}
console.log('Hello, let me query fire cloudstore ');
main();