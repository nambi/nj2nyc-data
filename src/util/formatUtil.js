const stations = require("/Users/nambi/work/nj2nyc/src/data/stations.json");

class FormatUtil {

    static reformatStations() {
        console.log("stations total", stations.length);
        let sortedStations = stations.sort((a, b) => {
            return a.sequence > b.sequence ? 0 : -1;
        });
        console.log("sorted stations", JSON.stringify(sortedStations));
    }
}

export default FormatUtil;