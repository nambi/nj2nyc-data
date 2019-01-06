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

    const defaultEntry = {
      "dayOfService": "MTH_FRI",
      "fromStationCode": "QUAD4LL",
      "toStationCode": "PABT",
      "startTime": 360,
      "endTime": 440,
      "mode": "BUS",
      "operatorCode": "SUBURBAN",
      "route": "LINE300",
      "tripName": "LINE300_SUBURBAN_BUS_1_QUAD4LL_PABT_EXIT8_MTH_FRI_600_720",
      "vehicleNumber": "1",
      "via": "EXIT8",
      "stops": {}
    };

    Object.defineProperty(this, 'trips', {
      value: [],
      writable: true
    });

    Object.defineProperty(this, 'currentEntry', {
      value: {},
      writable: true
    });

    Object.defineProperty(this, 'defaultTripEntry', {
      value: defaultEntry,
      writable: false
    });

  }
  /** Main Entry Point */
  static main() {
    console.log('This is the main entry point');
    const myApp = new App();
    myApp.vorpal = new Vorpal();
    myApp.showTripEntryForm();
  }
  addStopCommand() {
    let self = this;

    self.vorpal
      .command('addStop', 'Capture Stop Details')
      .action(function (args, callBackToEntryForm) {
        if (self.currentEntry.tripId && self.currentEntry.tripId > 0) {
          let questions = [
            {
              type: 'input',
              name: 'stationCode',
              message: 'Enter Station Code : '
            },
            {
              type: 'input',
              name: 'arrivalTime',
              message: 'Enter Arrival Time : '
            },
            {
              type: 'input',
              name: 'stopSequence',
              message: 'Enter Stop Sequence : '
            }
          ];

          this.log('Adding a stop for TripId', self.currentEntry.tripId);
          let command = this;
          this.prompt(questions, function (answers) {
            const station = answers.stationCode.toUpperCase();
            self.currentEntry['stops'][station] = {};
            let stop = self.currentEntry['stops'][station];
            // validate entries 
            //Calculate the Time 
            stop['aTime'] = answers.arrivalTime;
            stop['dTime'] = answers.arrivalTime;
            stop['seq'] = answers.stopSequence;
            self.vorpal.log('Stop Added ' + station + ' :', stop);

            command.prompt([{ type: 'input', name: 'repeat', message: 'Add another stop (y/n) ?' }], function (answers) {
              const tryanother = answers.repeat;
              self.vorpal.log('what did you answer ', tryanother);
              if (tryanother && tryanother === 'y') {
                self.vorpal.execSync('addStop');
              } else {
                self.vorpal.log('what did you answer 2', tryanother);
                command.prompt([{ type: 'input', name: 'repeat', message: 'Add a Trip (y/n) ?' }], function (tripAnswers) {
                  let tryanother = tripAnswers.repeat;
                  self.vorpal.log('what did you answer 3', tryanother);
                  if (tryanother && tryanother === 'y') {
                    self.vorpal.execSync('addTrip');
                  } else {
                    callBackToEntryForm ? callBackToEntryForm() : self.vorpal.show();
                  }
                });
              }
              callBackToEntryForm ? callBackToEntryForm() : self.vorpal.show();
            });
          });
        } else {
          console.log('Adding Stop not valid without a valid trip');
          callBackToEntryForm();
        }

      });
  }
  addTripCommand() {
    let self = this;
    self.vorpal
      .command('addTrip', 'Capture Trip Details.')
      .action(function (args, callBackToEntryForm) {

        let questions = [
          {
            type: 'input',
            name: 'tripId',
            message: 'Enter TripId: '
          }/*, {
            type: 'input',
            name: 'route',
            message: 'What is the trip route number ? '
          },
          {
            type: 'input',
            name: 'via',
            message: 'What is the exit route (EXIT8 or EXIT8) '
          },
          {
            type: 'input',
            name: 'mode',
            message: 'What is the mode of this Trip (BUS, CAR, TRAIN)? '
          },
          {
            type: 'input',
            name: 'vehicleNumber',
            message: 'What is vehicle number? '
          },

          {
            type: 'input',
            name: 'dayOfService',
            message: 'Enter Days of Service (options MTH, MTH_FRI, SAT, SUN,HOL) '
          },
          {
            type: 'input',
            name: 'operatorCode',
            message: 'Who operates this Trip? '
          },
          {
            type: 'input',
            name: 'fromStationCode',
            message: 'Where does it start from? '
          },
          {
            type: 'input',
            name: 'starTime',
            message: 'When does it start? '
          },
          {
            type: 'input',
            name: 'fromStationCode',
            message: 'Where does it terminates? '
          },
          {
            type: 'input',
            name: 'endTime',
            message: 'When does it terminates? '
          }*/
        ];
        let command = this;
        this.prompt(questions, function (answers) {
          self.currentEntry = {};
          self.currentEntry['tripId'] = answers.tripId;
          // self.currentEntry['dayOfService'] = answers.dayOfService.toUpperCase();;
          self.currentEntry['stops'] = {};
          self.trips.push(self.currentEntry);
          self.vorpal.log('Trip Added', answers);

          command.prompt([{ type: 'input', name: 'repeat', message: 'Add a stop (y/n) ?' }], function (stopAnswers) {
            const tryanother = stopAnswers.repeat;

            if (tryanother && tryanother === 'y') {
              self.vorpal.execSync('addStop');
            } else {
              command.prompt([{ type: 'input', name: 'repeat', message: 'Add a Trip (y/n) ?' }], function (tripAnswers) {
                let tryanother = tripAnswers.repeat;
                if (tryanother && tryanother === 'y') {
                  self.vorpal.execSync('addTrip');
                } else {
                  callBackToEntryForm ? callBackToEntryForm() : self.vorpal.show();
                }
              });
            }
            callBackToEntryForm ? callBackToEntryForm() : self.vorpal.show();
          });

        });
      });
  }
  clearCommand() {
    let self = this;
    self.vorpal
      .command('clear', 'Clear the entries and setup new session')
      .action(function (args, callBackToEntryForm) {
        this.log('Total Trips :', self.trips.length);
        self.trips = [];
        self.currentEntry = {};
        this.log('All Cleared :', JSON.stringify(self.trips));
        callBackToEntryForm();
      });
  }
  printCommand() {
    let self = this;
    self.vorpal
      .command('print', 'Print All Trip Details as JSON')
      .action(function (args, callBackToEntryForm) {
        this.log('Total Trips :', self.trips.length);
        this.log('Trips :', JSON.stringify(self.trips));
        callBackToEntryForm();
      });
  }
  showTripEntryForm() {
    let self = this;

    console.log('Displaying the Trip Entry Form');

    self.addTripCommand();
    self.addStopCommand();
    self.printCommand();
    self.clearCommand();

    self.vorpal
      .delimiter('nj2nyc-data$')
      .show();
    self.vorpal.execSync('addTrip');
  }
}

export default App;
