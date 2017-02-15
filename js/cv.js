/* -------------------------------- 
// CV.JS
-------------------------------- */ 
var months = [ "January","February","March","April","May","June","July","August","September","October","November","December" ];
moment().format();

// LOOP EVERY JOB ENTRY
$('.job').each(function(i){
  var thisJobI = i,
      thisTime,
      startMonth,
      startYear,
      startDate,
      endMonth,
      endYear,
      endDate;
  
  // FIND ALL TIMES
  $(this).find('time').each(function(i){
    thisTime = $(this).html();
    
    if ( thisTime == 'Present') {
      var dateObj  = new Date(),
          month    = dateObj.getMonth(),
          year     = dateObj.getFullYear(),
          thisTime = months[month] + ' ' + year;    
    }
    
    // IF FIRST TIME - START DATE / IF LAST - END DATE
    switch (i) {
      case 0: // start
        startMonth  = singleDigit( getMonthFromString( thisTime.split(' ')[0] ) ),
        startYear   = thisTime.split(' ')[1],
        startDate   = startYear + '-' + startMonth;
        break;
      case 1: // end
        endMonth    = singleDigit( getMonthFromString( thisTime.split(' ')[0] ) ),
        endYear     = thisTime.split(' ')[1],
        endDate     = endYear + '-' + endMonth;
        break;
    }
  });

  // POPULATE FIELDS
  var m1      = moment(startDate,'YYYY-MM'),
      m2      = moment(endDate,'YYYY-MM'),
      diff    = moment.preciseDiff(m1, m2);
  
	$(this).find('time.start-date').attr('datetime', startDate);
  $(this).find('time.end-date').attr('datetime', endDate);
  $(this).find('h6 .duration').html(diff);
});

// ADD ZERO IF NUMBER IS SINGLE DIGIT
function singleDigit(n){
  return n > 9 ? "" + n: "0" + n;
}

// CONVERT MONTH STRING INTO NUMBER
function getMonthFromString(mon){
  var d = Date.parse(mon + "1, 2012");
  if(!isNaN(d)){
    return new Date(d).getMonth() + 1;
  }
  return -1;
}