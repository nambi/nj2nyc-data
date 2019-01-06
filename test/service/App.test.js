import firebase from "firebase";
import fs from "firebase/firestore";

import fbConfig from './../../config/fbConfig.json';
import FormatUtil from './../../src/util/formatUtil';

class AppTest {

    static main() {
        const self = new AppTest();
        self.testCloudStore();
    }

    testFormatUtil() {
        FormatUtil.reformatStations();

    }
    testTimer() {
        let a = 100;

        setInterval(function () {
            console.log('afer sometime');
            console.log('this is debug config');
            console.info('this is just a test', a);
        }, 1000);
    }
    testCloudStore() {
       
        console.log('config',fbConfig);

        firebase.initializeApp(fbConfig);

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
        let query = tripsRef.where("dayOfService", "==", dayOfService)
            .where("stops." + fromStationCode + ".stop", "==", true)
            .where("stops." + toStationCode + ".stop", "==", true)
            .where("stops." + fromStationCode + ".dTime", ">=", startTime)
            .where("stops." + fromStationCode + ".dTime", "<=", endTime);

        let trips = [];
        query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    const d = doc.data();
                    trips.push(d);
                    console.log(doc.id + '-' + JSON.stringify(d));

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            });
            console.log("No of trips found ", trips.length);

        }).catch(function (error) {
            console.log("Error getting cached document:", error);
        });
    
    }

}

export default AppTest;