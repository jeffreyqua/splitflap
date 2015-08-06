$(window).load(function(){
  var currentDate = moment().format("YYYY-MM-DD");
  initDbTotals();
  var previousTotals = 0;
  // console.log(previousTotals);

  var totalNum = '000000';
  var yesterdayNum = '0000';
  var todayNum = '0000';


  var totalDisplay = $("#total").splitflap({
    initial: "000000",
    glyphSet: [" ", "0","1","2","3","4","5","6","7","8","9"]
  });

  var yesterdayDisplay = $("#yesterday").splitflap({
    initial: "0000",
    glyphSet: [" ", "0","1","2","3","4","5","6","7","8","9"]
  });

  var todayDisplay = $("#today").splitflap({
    initial: "0000",
    glyphSet: [" ", "0","1","2","3","4","5","6","7","8","9"]
  });


  // totalDisplay.splitflap("value", pad(totalNum+todayNum,6));
  // yesterdayDisplay.splitflap("value", yesterdayNum);
  // todayDisplay.splitflap("value", pad(todayNum,4));

  // Listen to Firebase
  var myDataRef = new Firebase('https://papercup22.firebaseio.com/');
  myDataRef.once('value', function(snapshot) {
    var todayDate = new Date();
    var yesterdayDate = new Date();

    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    var todayDateYmd = moment(todayDate).format("YYYY-MM-DD");
    var yesterdayDateYmd = moment(yesterdayDate).format("YYYY-MM-DD");

    var obj = snapshot.val();

    yesterdayNum = obj.paper_cup_totals[yesterdayDateYmd]; // Yesterday
    totalNum = calculateTotalsData(obj.paper_cup_totals); // Total from previous days
    todayNum = calculateFirebaseObjDayTotal(obj.paper_cup_count[todayDateYmd]); // Today

    refreshValues(); // Refresh
  });

  // Trigger changes
  myDataRef.on('value', function(snapshot) {
    var todayDate = new Date();
    var yesterdayDate = new Date();

    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    var todayDateYmd = moment(todayDate).format("YYYY-MM-DD");
    var yesterdayDateYmd = moment(yesterdayDate).format("YYYY-MM-DD");

    var obj = snapshot.val();

    yesterdayNum = obj.paper_cup_totals[yesterdayDateYmd]; // Yesterday
    totalNum = calculateTotalsData(obj.paper_cup_totals); // Total from previous days
    todayNum = calculateFirebaseObjDayTotal(obj.paper_cup_count[todayDateYmd]); // Today

    refreshValues(); // Refresh
  });



  // Listen to Total
  // var myDataRefTotal = new Firebase('https://boiling-torch-7735.firebaseio.com/cups/total');
  // myDataRefTotal.on('value', function(snapshot) {
  //   var totalValue = snapshot.val();
  //   totalNum = totalValue;
  // });

  // // Listen to Yesterday
  // var myDataRefYesterday = new Firebase('https://boiling-torch-7735.firebaseio.com/cups/yesterday');
  // myDataRefYesterday.on('value', function(snapshot) {
  //   var yesterdayValue = snapshot.val();
  //   yesterdayNum = yesterdayValue;
  //   yesterdayDisplay.splitflap("value", pad(yesterdayNum,4));
  //   updateCompare();
  // });

  // // Listen to Today
  // var myDataRefToday = new Firebase('https://boiling-torch-7735.firebaseio.com/cups/today');
  // myDataRefToday.on('value', function(snapshot) {
  //   var todayValue = snapshot.val();
  //   todayNum = todayValue;
  //   todayDisplay.splitflap("value", pad(todayNum,4));
  //   totalDisplay.splitflap("value", pad(todayNum+totalNum,6));
  //   updateCompare();
  // });

  function refreshValues() {
    yesterdayDisplay.splitflap("value", pad(yesterdayNum,4));
    todayDisplay.splitflap("value", pad(todayNum,4))
    totalDisplay.splitflap("value", pad(todayNum+totalNum,6));
    updateCompare();
  }
  function updateCompare() {
    if (yesterdayNum<=todayNum) {
      $("#compare").html("<");
    }
    else {
      $("#compare").html(">");
    }
  }


  // Pad some numbers
  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
});