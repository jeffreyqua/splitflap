$(window).load(function(){

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


  totalDisplay.splitflap("value", totalNum.toString());
  yesterdayDisplay.splitflap("value", yesterdayNum.toString());
  todayDisplay.splitflap("value", todayNum.toString());


  // Pad some numbers
  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  // Listen to Total
  var myDataRefTotal = new Firebase('https://boiling-torch-7735.firebaseio.com/cups/total');
  myDataRefTotal.on('value', function(snapshot) {
    var totalValue = snapshot.val();
    totalNum = pad(totalValue,6);
    totalDisplay.splitflap("value", totalNum);
  });

  // Listen to Yesterday
  var myDataRefYesterday = new Firebase('https://boiling-torch-7735.firebaseio.com/cups/yesterday');
  myDataRefYesterday.on('value', function(snapshot) {
    var yesterdayValue = snapshot.val();
    yesterdayNum = pad(yesterdayValue,4);
    yesterdayDisplay.splitflap("value", yesterdayNum);
    updateCompare();
  });

  // Listen to Today
  var myDataRefToday = new Firebase('https://boiling-torch-7735.firebaseio.com/cups/today');
  myDataRefToday.on('value', function(snapshot) {
    var todayValue = snapshot.val();
    todayNum = pad(todayValue,4);
    todayDisplay.splitflap("value", todayNum);
    updateCompare();
  });

  function updateCompare() {
    if (yesterdayNum<=todayNum) {
      $("#compare").html("<");
    }
    else {
      $("#compare").html(">");
    }
  }
});