import Vorpal from "vorpal";

/**
     * Todo 
     * 1. Get Entire trip details (with minimal inputs)
     * 2. Create trip jason from the inputs (calculate time defaults )
     * 3. Store the json as a file 
     * 4. Create new trip document in firestore 
     * 5. Create composite index programattically 
     * (may be we should create trip json with all stops and just use the stop field as true or false, 
     * this way we can just have one index with all the stations in the map)
     * It will be easy to crate a default trip document as well 
     * 5. validate the firestore document with query & input json 
     */

class App {
  constructor() {
    console.log('initialized the app');
  }
  /** Main Entry Point */
  static main() {
    console.log('This is the main entry point');
    const myApp = new App();
    myApp.vorpal = new Vorpal();
    myApp.showTripEntryForm();
  }
  showTripEntryForm() {
    console.log('Displaying the Trip Entry Form');
    this.vorpal
      .command('foo [tripId] [dayOfService]', 'Outputs "bar".')
      .action(function (args, callback) {
        const tripId = args.tripId;
        const dayOfService = args.dayOfService;
        this.log('bar :', tripId);
        callback();
      });

    this.vorpal
      .delimiter('nj2nyc-data$')
      .show();
  }
}

export default App;
