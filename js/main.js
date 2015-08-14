$(window).load(function(){
  startTime();

  var startDateYM = "2015-07"; // when earliest data starts
  var currentDate = moment().format("YYYY-MM-DD");

  // Set the monthly view variables
  var todayDate = new Date();
  var currentYM = moment().format("YYYY-MM");
  var currentYMtext = moment().format("MMMM YYYY");
  refreshMonthlyGraph(); // Refresh the graph

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
        $("#hour"+i+ " .value").html(hourArray[i]);
      }
    }


    refreshValues(); // Refresh
  });

  // Initialize button clicks for month
  $("#prev-month .button").click(function() {
    mGraphPrevMonth();
    refreshMonthlyGraph();
  });

  $("#next-month .button").click(function() {
    mGraphNextMonth();
    refreshMonthlyGraph();
  });

  // Functions

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

  function mGraphNextMonth() {
    if (currentYM < moment().format("YYYY-MM")){
      var curYear = currentYM.substr(0,4);
      var curMonth = parseInt(currentYM.substr(5));

      var nextMonthDate = new Date();
      nextMonthDate.setFullYear(curYear);
      nextMonthDate.setMonth(curMonth + 1);
      nextMonth = nextMonthDate.getMonth();

      currentYM = nextMonthDate.getFullYear()+'-'+pad(nextMonth,2);
      currentYMtext = moment(nextMonthDate.getFullYear()+pad(nextMonth,2)+'01',"YYYYMMDD").format("MMMM YYYY");
    }
  }
  function mGraphPrevMonth() {
    if (currentYM > startDateYM) {
      var curYear = currentYM.substr(0,4);
      var curMonth = parseInt(currentYM.substr(5));

      var prevMonthDate = new Date();
      prevMonthDate.setFullYear(curYear);
      prevMonthDate.setMonth(curMonth - 1);
      prevMonth = prevMonthDate.getMonth();

      currentYM = prevMonthDate.getFullYear()+'-'+pad(prevMonth,2);
      currentYMtext = moment(prevMonthDate.getFullYear()+pad(prevMonth,2)+'01',"YYYYMMDD").format("MMMM YYYY");
    }
  }

  function refreshMonthlyGraph() {
    var currentMonthArray = [];
    // get totals for currentYM year/month
    var ref = new Firebase('https://papercup22.firebaseio.com/paper_cup_totals');

    ref.once('value', function(snapshot) {
      var totalsObj = snapshot.val();

      snapshot.forEach(function(data) {
        // If current month, then add:
        var currentKey = data.key();
        if (currentKey.indexOf(currentYM) == 0) {
          var dayValue = currentKey.substr(8);
          currentMonthArray.push({'day':dayValue,'value':data.val()});
        }
        // total += data.val();
      });

      // update the monthly graph using values in currentMonthArray
      $("#month_bars .day .bar").css("height", 0);

      $("#month_bars .day .value").html('').css('bottom',0);
      currentMonthArray.forEach(function(el){
        $("#day"+el.day+" .bar").css('height',el.value);

        if (el.value>0) {
          $("#day"+el.day+ " .value").css('bottom', el.value+5);
          $("#day"+el.day+ " .value").html(el.value);
        }
        else {
          $("#day"+el.day+ " .value").css('bottom', el.value);
          $("#day"+el.day+ " .value").html(el.value);
        }
      });

      // check if current month, if so, hide future months
      if (currentYM >= moment().format("YYYY-MM")){
        $("#next-month .button").fadeOut();
      }
      else {
        $("#next-month .button").fadeIn(1000);
      }

      if (currentYM <= startDateYM) {
        $("#prev-month .button").fadeOut();
      }
      else {
        $("#prev-month .button").fadeIn(1000);
      }


      $("#current-month").html(currentYMtext);
    });
    // Unauthenticate the client
    ref.unauth();
  }


});