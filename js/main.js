$(window).load(function(){
  startTime();

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
    var hourArray = calculateFirebaseObjHourTotals(obj.paper_cup_count[todayDateYmd]);
    // console.log(hourArray);

    for (var i=0; i<hourArray.length; i++) {
      $("#hour"+i).css('height', 6*hourArray[i]);
      if (hourArray[i]>0) {
        $("#hour"+i+ " .value").css('bottom', 6*hourArray[i]+5);
        $("#hour"+i+ " .value").html(hourArray[i]);
      }
      else {
        $("#hour"+i+ " .value").css('bottom', 5);
        $("#hour"+i+ " .value").html(0);
      }
    }

    refreshValues(); // Refresh
  });

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



  // Clock
  function startTime() {
    var today=new Date();
    var todayFormatted = moment().format("dddd DD MMMM YYYY");

    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('date').innerHTML = todayFormatted;
    document.getElementById('clock').innerHTML = h+":"+m+":"+s;
    var t = setTimeout(function(){startTime()},500);
  }

  function checkTime(i) {
      if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
      return i;
  }
});