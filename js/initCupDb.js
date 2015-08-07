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

  for (var key in obj) {
    total += obj[key];
  }

  return total;
}