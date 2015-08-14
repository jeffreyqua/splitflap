// initialize the database
function initDbTotals() {
  // check if the current date is accurate
  var startDate = new Date("2015-08-06");
  var currentDate = new Date();
  var timeDiff = Math.abs(currentDate.getTime() - startDate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1; 

  var currentDateYmd = moment().format("YYYY-MM-DD");

  var fbRef = new Firebase('https://papercup22.firebaseio.com/');
  fbRef.on('value', function(snapshot) {
    var fbObj = snapshot.val();
    var cupData = fbObj.paper_cup_count;
    var cupTotals = fbObj.paper_cup_totals;
    for (var i = diffDays; i > 0; i--) {
      var iDate = new Date();
      iDate.setDate(iDate.getDate() - i);
      var iDateYmd = moment(iDate).format("YYYY-MM-DD");
      // console.log(iDateYmd);

      if (!cupTotals || !cupTotals[iDateYmd]) {
        var iDateTotal = 0;
        if (cupData[iDateYmd]) {
          iDateTotal = calculateFirebaseObjDayTotal(cupData[iDateYmd]);

          // Update the total
          var iDateRef = new Firebase('https://papercup22.firebaseio.com/paper_cup_totals/'+iDateYmd);
          iDateRef.set(iDateTotal, function(error) {
            iDateRef.once("value", function(snapshotB) {
              var data = snapshotB.val();
            });
          });
        }
      }
    }
  });

}

// Calculate Data Totals for a specific day object raw data node
function calculateFirebaseObjDayTotal(obj) {
  var dayTotal = 0;
  var deltaLimit = 5;
  for (var key in obj) {
    var differential = obj[key].differential;
    if (Math.abs(differential) <= deltaLimit) {
      // console.log(differential);
      // ignore any changes more than 5 cups
      dayTotal -= differential;
    }
  }
  return dayTotal;
}


// Calculate Data Totals for a specific day object raw data node
function calculateFirebaseObjHourTotals(obj) {
  var hourTotal0 = 0;
  var hourTotal1 = 0;
  var hourTotal2 = 0;
  var hourTotal3 = 0;
  var hourTotal4 = 0;
  var hourTotal5 = 0;
  var hourTotal6 = 0;
  var hourTotal7 = 0;
  var hourTotal8 = 0;
  var hourTotal9 = 0;
  var hourTotal10 = 0;
  var hourTotal11 = 0;
  var hourTotal12 = 0;
  var hourTotal13 = 0;
  var hourTotal14 = 0;
  var hourTotal15 = 0;
  var hourTotal16 = 0;
  var hourTotal17 = 0;
  var hourTotal18 = 0;
  var hourTotal19 = 0;
  var hourTotal20 = 0;
  var hourTotal21 = 0;
  var hourTotal22 = 0;
  var hourTotal23 = 0;

  var deltaLimit = 5;
  for (var key in obj) {
    var differential = obj[key].differential;
    if (Math.abs(differential) <= deltaLimit) {
      // console.log(differential);
      // ignore any changes more than 5 cups
      var currentTime = obj[key].timestamp;
      var currentHour = moment(currentTime).format("HH");
      // console.log(currentHour);
      if (currentHour == '00') {
        hourTotal0 -= differential;
      }
      else if (currentHour == '01') {
        hourTotal1 -= differential;
      }
      else if (currentHour == '02') {
        hourTotal2 -= differential;
      }
      else if (currentHour == '03') {
        hourTotal3 -= differential;
      }
      else if (currentHour == '04') {
        hourTotal4 -= differential;
      }
      else if (currentHour == '05') {
        hourTotal5 -= differential;
      }
      else if (currentHour == '06') {
        hourTotal6 -= differential;
      }
      else if (currentHour == '07') {
        hourTotal7 -= differential;
      }
      else if (currentHour == '08') {
        hourTotal8 -= differential;
      }
      else if (currentHour == '09') {
        hourTotal9 -= differential;
      }
      else if (currentHour == '10') {
        hourTotal10 -= differential;
      }
      else if (currentHour == '11') {
        hourTotal11 -= differential;
      }
      else if (currentHour == '12') {
        hourTotal12 -= differential;
      }
      else if (currentHour == '13') {
        hourTotal13 -= differential;
      }
      else if (currentHour == '14') {
        hourTotal14 -= differential;
      }
      else if (currentHour == '15') {
        hourTotal15 -= differential;
      }
      else if (currentHour == '16') {
        hourTotal16 -= differential;
      }
      else if (currentHour == '17') {
        hourTotal17 -= differential;
      }
      else if (currentHour == '18') {
        hourTotal18 -= differential;
      }
      else if (currentHour == '19') {
        hourTotal19 -= differential;
      }
      else if (currentHour == '20') {
        hourTotal20 -= differential;
      }
      else if (currentHour == '21') {
        hourTotal21 -= differential;
      }
      else if (currentHour == '22') {
        hourTotal22 -= differential;
      }
      else if (currentHour == '23') {
        hourTotal23 -= differential;
      }
    }
  }
  return [hourTotal0, hourTotal1, hourTotal2, hourTotal3, hourTotal4, hourTotal5, hourTotal6, hourTotal7, hourTotal8, hourTotal9, hourTotal10, hourTotal11, hourTotal12, hourTotal13, hourTotal14, hourTotal15, hourTotal16, hourTotal17, hourTotal18, hourTotal19, hourTotal20, hourTotal21, hourTotal22, hourTotal23];
}

// Calculate Totals up until today
function calculateTotals() {
  var total = 0;
  var startDate = new Date("2015-08-06");
  var currentDate = new Date();
  var timeDiff = Math.abs(currentDate.getTime() - startDate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1; 

  var currentDateYmd = moment().format("YYYY-MM-DD");


  var totalsRef = new Firebase('https://papercup22.firebaseio.com/paper_cup_totals');
  totalsRef.on('value', function(snapshot) {
    var totalsObj = snapshot.val();

    snapshot.forEach(function(data) {
      total += data.val();
    });


    return total;
  });
}

function calculateTotalsData(obj) {
  var total = 0;
  var startDateYmd = "2015-08-06";

  for (var key in obj) {
    //console.log(key, startDateYmd<=key);

    // Only count totals if it's above the actual start date
    if (startDateYmd<=key) {
      total += obj[key];
    }
  }

  return total;
}