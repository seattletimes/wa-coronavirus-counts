// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var $ = require('jquery');
const d3 = require("d3");



////CHANGE ME WHEN DAY CHANGES - FOR DAY OF DATA/////
// var day_var = "1216";

//// change me every month ////
var monthTicks = ["3/1/20", "4/1/2020", "5/1/2020", "6/1/2020", "7/1/2020","8/1/2020","9/1/2020","10/1/2020","11/1/2020","12/1/2020","1/1/2021", "2/1/2021", "3/1/2021", "4/1/2021", "5/1/2021", "6/1/2021", "7/1/2021", "8/1/2021", "9/1/2021", "10/1/2021", "11/1/2021", "12/1/2021", "1/1/2022", "2/1/2022", "3/1/2022", "4/1/2022"];

var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

var commaFormat = d3.format(',');
// var county_counts = window.case_data[`waCountyCases${day_var}`];
// var county_deaths = window.case_data[`waCountyDeaths${day_var}`];

var county_pops = require("../assets/waPop2020.json");

var county_counts = window.CountyCounts;

var county_deaths = window.CountyDeaths;

var dohNumbers = window.DOH_Totals;
// var county_pops = window.case_dataTwo['waPop2020'];





var stateTotal = 7656200;

let colors = {
  cases: ["#D8894E"],
  deaths: ["#D15959"],
  casesPop: ["#FFE9CF",'#ffc88a','#d28449','#914c14','#730505'],
  deathsPop: ['#ffd9d7','#ff9894','#d05858','#931f2b','#61000a'],
  cases_2Wks: ["#f77f50"],
  casesPop_2Wks: ['#ffe8d6', '#ffae83', '#f77f50', '#da492b', '#b30000']
}

let buckets = {
  cases: [1],
  deaths: [0.1],
  casesPop: [0.1, 1200.1, 1500.1, 1800.1, 2100.1],
  deathsPop: [0.1, 10.1, 15.1, 20.1, 25.1],
  cases_2Wks: [1],
  casesPop_2Wks: [0.1, 20.1, 40.1, 60.1, 80.1]
}

// let spot_buckets = {
//   cases_2Wks: [1],
//   casesPop_2Wks: [0.1, 5.1, 10.1, 15.1,20.1],
// }

var day_var = county_counts[county_counts.length - 1];
day_var = day_var.Date;
day_var = day_var.split("/");



var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// var dataMonth = day_var.slice(0, 2);
// var dataDay = day_var.slice(2, 4);
var dataMonth = day_var[0];
var dataDay = day_var[1];


dataMonth = parseInt(dataMonth) - 1;
var dateNew = months[dataMonth] + " " + dataDay;


if($('#countyMapGraphic').length >0 ){
  var countyMapGraphic = document.getElementById("countyMapGraphic");
  var lastest_day = county_counts.length - 1;
      lastest_day = county_counts[lastest_day];


  var lastest_deaths = county_deaths.length - 1;
      lastest_deaths = county_deaths[lastest_deaths];

  var svgCounty = d3.select("#svg3071"),
        gCounty = svgCounty.append("g");

  // console.log(lastest_deaths);
  unnCases = parseInt( lastest_day["Unassigned"] );
  unnDeaths = parseInt( lastest_deaths["Unassigned"] );

  $('.unassigned.cases.casesPop span').empty().append(commaFormat(unnCases));
  $('.unassigned.deaths.deathsPop span').empty().append(unnDeaths);

  $('#date').empty().text(dateNew);



  var countyMap = document.getElementById("svg3071");
  var counties = countyMap.getElementsByClassName("county");
  let caseTotals = 0;
  let deathTotals = 0;

  for (let i = 0; i < counties.length; i++) {
      var countyName = counties[i].id;
      var case_value = parseInt( lastest_day[countyName] );
      var death_value = parseInt( lastest_deaths[countyName] );
      caseTotals = caseTotals + parseInt(case_value);
      deathTotals = deathTotals + parseInt(death_value);
      var bbox = d3.select("#" + countyName).node().getBBox();

      var countyObj = county_pops[i];
      var countyPop = countyObj["pop_2020"];

      var popAdjCase = (case_value / countyPop) * 10000;
      popAdjCase = popAdjCase.toFixed(1);
      var popAdjDeath = (death_value / countyPop) * 10000;
      popAdjDeath = popAdjDeath.toFixed(1);

      let dataset = {
        cases: case_value,
        casesPop: popAdjCase,
        deaths: death_value,
        deathsPop: popAdjDeath
      };

      counties[i].numbers = dataset;

           var centroid = [
               bbox.x + bbox.width/2,
               bbox.y + bbox.height/2
           ];

       var pushVar = 0;

       if (countyName === "Walla_Walla") { pushVar =  40; };
       if (countyName === "Garfield") { pushVar =  -20; };
       if (countyName === "Columbia") { pushVar =  10; };

       countyName = countyName.replace(/_/g, ' ');


       		var circle = svgCounty.selectAll('g').append('text')
           .attr("class", "covidNum cases")
       		 .attr("font-weight","bold")
       		 .attr("text-anchor", "middle")
       		 .html(function () {
         	 	return ("<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar) + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + commaFormat(case_value) + "</tspan>");
       		 });


       		 var circleDeaths = svgCounty.selectAll('g').append('text')
       			.attr("class", "covidNum deaths")
       			.attr("font-weight","bold")
       			.attr("text-anchor", "middle")
       			.html(function () {
       			 return ("<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + commaFormat(death_value) + "</tspan>");
       			});

            var circleAdjCases = svgCounty.selectAll('g').append('text')
             .attr("class", "covidNum casesPop")
             .attr("font-weight","bold")
             .attr("text-anchor", "middle")
             .html(function () {
              return ("<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + commaFormat(popAdjCase) + "</tspan>");
             });

             var circleAdjDeaths = svgCounty.selectAll('g').append('text')
              .attr("class", "covidNum deathsPop")
              .attr("font-weight","bold")
              .attr("text-anchor", "middle")
              .html(function () {
               // return ( popAdjDeath > 0.0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + popAdjDeath + "</tspan>" : "");
               return ("<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + (popAdjDeath > 0.0 ? popAdjDeath : "0") + "</tspan>");
              });

  } // for loop end




  $('#casesTotal').empty().append(commaFormat(caseTotals + unnCases));
  $('#deathsTotal').empty().append(commaFormat(deathTotals + unnDeaths));

  var num = (caseTotals + unnCases) / stateTotal * 10000;
  num = num.toFixed(1);
  var num2 = (deathTotals + unnDeaths) / stateTotal * 10000;
  num2 = num2.toFixed(1);

  $('#casesAdj').empty().append(commafy(num));
  $('#deathsAdj').empty().append(num2);

  var myFunction = function(chosenID) {
    document.querySelectorAll('.caseKey, .covidNum, .unassigned').forEach(el => el.classList.remove('active'));
    document.getElementById(chosenID).classList.add('active');
    document.querySelectorAll(`.${chosenID}`).forEach(el => el.classList.add('active'));

    colorMap(chosenID);
  };

  var colorMap = function(chosenColor) {
    for (let i = 0; i < counties.length; i++) {
      counties[i].style.fill = "#e2e2e2";

      for (let h = 0; h < buckets[chosenColor].length; h++) {
        let bucketArray = buckets[chosenColor];
        let colorArray = colors[chosenColor];
        if ( counties[i].numbers[chosenColor] >= bucketArray[h]  ) {
           counties[i].style.fill = colorArray[h];
        }
      };
    };
  };



  document.querySelectorAll(".radioButton1").forEach(el => el.addEventListener('click', () => myFunction(el.value)) );


   myFunction('cases');

} else {}








 //////////////////////// TRENDS COUNTY CHART //////////////



if($('#countyTrendGraphic').length >0 ){
  var conWidth = $("#barChart").width();

  var conHeight = (conWidth > 500) ? 500 : 300;


  var tooltip = d3.select(".counter .body");
  var dateBox = d3.select(".counter .head .date");

  var textBox = tooltip.append("div");
  var toolData = textBox.append("div").attr("class","toolData");


 var margin = {top: 20, right: 0, bottom: 20, left: 80},
     width = conWidth - margin.left - margin.right,
     height = conHeight - margin.top - margin.bottom;

 var x0 = d3.scaleBand().range([0, width]).padding(.05);

 var x1 = d3.scaleBand().padding(.05);

 var y = d3.scaleLinear()
     .range([height, 0]);

 var xAxis = d3.axisBottom()
     .scale(x0)
     .tickValues(monthTicks)
     .tickFormat((d, i) => ["3/2020", "4/2020", "5/2020", "6/2020", "7/2020","8/2020","9/2020","10/2020","11/2020","12/2020","1/2021", "2/2021", "3/2021", "4/2021", "5/2021", "6/2021", "7/2021", "8/2021", "9/2021", "10/2021", "11/2021", "12/2021", "1/2022", "2/2022", "3/2022", "4/2022"][i]);

 var yAxis = d3.axisLeft()
     .scale(y);

     xAxis.tickSizeOuter(0);




 var svg = d3.select("#barChart").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("class","mainG")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var yBegin;

 // var innerColumns = {
 //   "column1" : ["Adams","Asotin","Benton","Chelan","Clallam","Clark","Columbia","Cowlitz","Douglas","Ferry","Franklin","Garfield","Grant","Grays_Harbor","Island","Jefferson","King","Kitsap","Kittitas","Klickitat","Lewis","Lincoln","Mason","Okanogan","Pacific","Pend_Oreille","Pierce","San_Juan","Skagit","Skamania","Snohomish","Spokane","Stevens","Thurston","Wahkiakum","Walla_Walla","Whatcom","Whitman","Yakima","Unassigned"],
 // }



 // var innerColumns = {"column1" : ["CasesTotal"]}




 var caseColors = ["#F3C882", "#E98729", "#B75317", "#7b2003", "#360d01", '#aaa'];
 var deathColors = ['#f6cac1', '#db8f87', '#ae5c5c', '#7c2f38', "#330107", '#aaa'];


 $('#date').empty().text(dateNew);


var myFunction = function(updateData, idClicked) {

  var casesOrDeaths = (idClicked === "casesCounty2") ? "CasesTotal" : "DeathsTotal";

  var innerColumns = {
    "column1" : [ casesOrDeaths ]
  };


  // d3.csv(updateData).then(
    // function(data) {

      // var columnHeaders = d3.keys(data[0]).filter(function(key) { return (key !== "Date") && (key !== "New") && (key !== "Roll_avg"); });

      var columnHeaders = d3.keys(updateData[0]).filter(function(key) { return (key === casesOrDeaths) });

      updateData.forEach(function(d) {
        var yColumn = new Array();
        d.columnDetails = columnHeaders.map(function(name) {
          for (ic in innerColumns) {
            if($.inArray(name, innerColumns[ic]) >= 0){
              if (!yColumn[ic]){
                yColumn[ic] = 0;
              }
              yBegin = yColumn[ic];
              yColumn[ic] += +d[name];
              return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
            }
          }
        });
        d.total = d3.max(d.columnDetails, function(d) {
          return d.yEnd;
        });
      });

      x0.domain(updateData.map(function(d) { return d.Date; }));
      x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);

      y.domain([0, d3.max(updateData, function(d) {
        return d.total;
      })]);

      svg.selectAll(".axis").remove();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".7em")
          .style("text-anchor", "end")
          .text("");


      svg.selectAll(".g").remove();

      var project_stackedbar = svg.selectAll(".project_stackedbar")
          .data(updateData)
        .enter().append("g")
          .attr("class", "g")
          .attr("id", function(d,i) {
           if (i === (updateData.length - 1)) {
             var barID = (idClicked === "casesCounty2") ? "gLast" : "gLast2";
             return barID;
           } else { return ("g" + i) };
          })
          .attr("transform", function(d) { return "translate(" + x0(d.Date) + ",0)"; })
          .style("cursor","pointer")
          .on("click", function(d) {
            toolData.selectAll("div").remove();
            clickedDate = d.Date;
            clickedDate = clickedDate.split("/");
            var clickedMonth = parseInt(clickedDate[0]) - 1;
            dateBox.text(months[clickedMonth] + " " + clickedDate[1]);

            d3.selectAll('.g').style("opacity","0.5");
            d3.select(this).style("opacity","1");

            for (const key of Object.keys(d)) {
              if (d[key] > 0) {


                var countyName = key;

                // console.log(countyName);
                countyName = countyName.replace(/_/g, ' ');
                var countyCount = commaFormat(d[key]);
                var colorKey;
                var colorSet = (idClicked === "casesCounty2") ? "Case" : "Death";

               if ( countyName === "total" ) {
                 var tspan1 = tooltip.select(".toolData").append("div").attr("class","entry");
                 tspan1.html("<span class='count'>" + countyName + ": " + countyCount + "</span>" );
                 tspan1.attr('x', 0).attr('dy', '1em');
               } else {}



              } else {}
            }
          });

      var bars = project_stackedbar.selectAll("rect")
          .exit()
          .remove()
          .data(function(d) {
            return d.columnDetails;
          })
          .enter().append("rect")
          .attr("width", x1.bandwidth())
          .transition()
          .duration(600)
          .attr("x", function(d) {
            return x1(d.column);
             })
          .attr("y", function(d) {
            return y(d.yEnd);
          })
          .attr("height", function(d) {
            return y(d.yBegin) - y(d.yEnd);
          })
          .style("fill", function(d) {
            var colorSet = (idClicked === "casesCounty2") ? caseColors : deathColors;
            if (d.name === "King") {
              return colorSet[0];
            } else if ( d.name === "Snohomish" ) {
              return colorSet[2];
            } else if ( d.name === "Pierce" ) {
              return colorSet[1];
           } else if ( d.name === "Yakima" ) {
             return colorSet[3];
          } else if ( d.name === "Unassigned" ) {
              return colorSet[5];
           } else { return colorSet[2]; }
         })
         .style("stroke", function(d) {
           var colorSet = (idClicked === "casesCounty2") ? caseColors : deathColors;
           if (d.name === "King") {
             return colorSet[0];
           } else if ( d.name === "Snohomish" ) {
             return colorSet[2];
           } else if ( d.name === "Pierce" ) {
             return colorSet[1];
          } else if ( d.name === "Yakima" ) {
             return colorSet[3];
           } else if ( d.name === "Unassigned" ) {
             return colorSet[5];
          } else { return colorSet[2]; }
        });

        if (idClicked === "casesCounty2") {
          d3.select('#gLast').dispatch('click');
        } else {
          d3.select('#gLast2').dispatch('click');
        }



  //});  // add paren after curly

}


 $( ".radioButton2" ).click(function() {
   var thisID = $(this).attr("id");
   $('.title').toggleClass("showMe");
   if ( thisID === "casesCounty2" ) {
     myFunction(dohNumbers, thisID);
   } else {
     myFunction(county_deaths, thisID);
   };

});


 myFunction(dohNumbers, "casesCounty2");


} else {}

/////////////////// NEW CASES AND DEATHS CHART /////////////

if($('#newbarChart').length >0 ){



 var myFunction1 = function(updateData, idClicked, countyLabel) {



   var conWidth = $("#newbarChart").width();
   var conHeight = (conWidth > 500) ? 450 : 220;

   var innerColumns2 = {
     "column1" : [`${countyLabel}`],
   }

   // d3.csv(updateData).then(
   //   function(data) {

       $('#graph').empty();



      var margin = {top: 20, right: 0, bottom: 40, left: 55},
          width = conWidth - margin.left - margin.right,
          height = conHeight - margin.top - margin.bottom;

      var x0 = d3.scaleBand().range([0, width]).padding(.05);

      var x1 = d3.scaleBand().padding(.05);

      var y = d3.scaleLinear()
          .range([height, 0]);

      var xAxis = d3.axisBottom()
          .scale(x0)
          .tickValues(monthTicks)
          .tickFormat((d, i) => ["3/2020", "4/2020", "5/2020", "6/2020", "7/2020","8/2020","9/2020","10/2020","11/2020","12/2020","1/2021", "2/2021", "3/2021", "4/2021", "5/2021", "6/2021", "7/2021", "8/2021", "9/2021", "10/2021", "11/2021", "12/2021", "1/2022", "2/2022", "3/2022", "4/2022"][i]);


      var yAxis = d3.axisLeft()
          .scale(y).ticks(5);

          xAxis.tickSizeOuter(0);


      var svg1 = d3.select("#newbarChart #graph").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("class","mainGraphic")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var yBegin;

       var prevDayData = 0;

       var columnHeaders = d3.keys(updateData[0]).filter(function(key) { return (key === countyLabel) && (key === `${countyLabel}Avg`) });

       // console.log(columnHeaders);
       var totalCases = 0;
       var prevDay = 0;
       var allCoun = 0;
       var kingNew = 0;
       var kingPrev = 0;

       updateData.forEach(function(d) {



         // kingNew = parseInt(d.King) - kingPrev;
         // kingPrev = parseInt(d.King);

         allCoun = countyLabel === "CasesNew" ? parseInt(d.CasesNew) : parseInt(d.DeathsNew);


         // allCoun = parseInt(d.CasesNew);
         var thisThing;

         var yColumn = new Array();
         d.columnDetails = columnHeaders.map(function(name) {
           for (ic in innerColumns2) {
             if($.inArray(name, innerColumns2[ic]) >= 0){
               // console.log(innerColumns2[ic]);
               if (!yColumn[ic]){
                 yColumn[ic] = 0;
               }
               yBegin = yColumn[ic];
               yColumn[ic] += +d[name];



               if (name === countyLabel) {
                 totalCases = parseInt(d[name]);
               } else {
                 totalCases = parseInt(d[name]) - prevDay;
                 prevDay = parseInt(d[name]);
               }


              thisThing = ic;



               return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin};

             }
           }
         });



         d.total = allCoun;
         d.allCoun = allCoun;
         d.column = thisThing;
       });



       x0.domain(updateData.map(function(d) { return d.Date; }));
       x1.domain(d3.keys(innerColumns2)).range([0, x0.bandwidth()]);

       y.domain([0, d3.max(updateData, function(d) { return d.allCoun;  })]);


       svg1.selectAll(".axis").remove();

       svg1.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + (height + 0) + ")")
           .call(xAxis);

       svg1.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".7em")
           .style("text-anchor", "end")
           .text("");


           svg1.selectAll(".gBar").remove();


           var project_stackedbar1 = svg1.selectAll(".project_stackedbar")
               .data(updateData)
             .enter().append("rect")
               .attr("class", "gBar")
               .attr("id", function(d,i) {
                 return ("g" + i);
               })
               .attr("transform", function(d) { return "translate(" + x0(d.Date) + ",0)"; })
               .attr("width", x1.bandwidth())
               .attr("data-total", function(d) {
                 return d.total;
               })
               .attr("data-avg", function(d) {
                 var theRightAvg = (countyLabel === "CasesNew") ? d.CasesNewAvg : d.DeathsNewAvg;
                 return theRightAvg;
               })
               .attr("data-date", function(d) {
                 clickedDate = d.Date;
                 clickedDate = clickedDate.split("/");
                 var clickedMonth = parseInt(clickedDate[0]) - 1;

                 return (months[clickedMonth] + " " + clickedDate[1]);
               })
               .transition()
               .duration(600)
               .attr("x", function(d) {
                 return x1(d.column);
                })
               .attr("y", function(d) {
                 return ((d.total > 0) ? y(d.total) : y( d.total + Math.abs(d.total) ));
               })
               .attr("height", function(d) {
                 // console.log(y(0) - y(d.total));
                 if (d.total > 0) {
                   return y(0) - y(d.total);
                 } else {
                   return y(d.total) - y(0);
                 }

               })
               .style("fill", function(d) {
                return ((idClicked === "casesCounty3") ? "#D8894E" : "#D15959");
              });




                var allBars = document.getElementsByClassName('gBar');
                var lastBar = allBars[allBars.length - 1];
                var lastID = lastBar.id;
                var selID = lastID.split("g");
                selID = parseInt( selID[1] );
                var endNum = selID;

              $( ".caret" ).click(function() {
                if ( this.id === "left" && selID > 0 ){
                  $( "#right" ).css("opacity",0.8) ;
                  selID === 1 ? $( "#left" ).css("opacity",0.1) : $( "#left" ).css("opacity",0.9) ;
                  selID -= 1;
                  selectBar( selID );
                } else if ( this.id === "right" && (selID < endNum) ) {
                  $( "#left" ).css("opacity",0.8) ;
                  selID === (endNum - 1) ? $( "#right" ).css("opacity",0.1) : $( "#right" ).css("opacity",0.9) ;
                  selID += 1;
                  selectBar( selID );
                } else {}
              });

              var selectBar = function(prevID){
                var newSel = "#g" + prevID;

                var dailyTotal = $(newSel).attr("data-total");
                var dailyDate = $(newSel).attr("data-date");
                var dailyAvg = $(newSel).attr("data-avg");

                $( ".gBar" ).css("opacity",0.5);
                $( newSel ).css("opacity",1);

                dailyTotal = commaFormat( parseInt(dailyTotal) );
                dailyAvg = commaFormat( parseInt(dailyAvg) );

                var follow = (idClicked === "casesCounty3") ? " cases" : " deaths";
                $('.newTooltip #date').empty().append(dailyDate);
                $('.newTooltip #total').empty().append(dailyTotal + follow);

                if (idClicked === "casesCounty3") {
                  $('.newTooltip #avg').empty().append("State 14-day average: " + dailyAvg);
                } else {
                  $('.newTooltip #avg').empty().append("Past 12 days of deaths are incomplete");
                }

              };

              selectBar( selID );
              $( "#right" ).css("opacity",0.1) ;



                //define the line
                var valueline = d3.line()
                    .x(function(d) { return x0(d.Date) + (x0.bandwidth() / 2); })
                    .y(function(d) {
                      // return y(d.Roll_avg);
                      // return y(d.Roll_avg);
                      var theRightAvg = (countyLabel === "CasesNew") ?  y(d.CasesNewAvg) :  y(d.DeathsNewAvg);

                      return theRightAvg;
                    });

                // var zeroLine = d3.line()
                //     .x(function(d) { return x0(d.Date) + (x0.bandwidth() / 2); })
                //     .y(function(d) {
                //       return y(0);
                //     });
                //
                // svg1.append("path")
                //     .data([updateData])
                //     .attr("class", "line")
                //     .attr("fill", "none")
                //     .attr("stroke", "#bbb")
                //     .attr("stroke-width", 1)
                //     .attr("d", zeroLine);

              // if (countyLabel === "CasesNew") {
                // Add the valueline path.
                svg1.append("path")
                    .data([updateData])
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", 2)
                    .attr("d", valueline);
              // }


         // }); d3 csv func

       }



  $( ".radioButton3" ).click(function() {
          var cOrD = this.getAttribute('data-type');
          var thisID = $(this).attr("id");
          $('.title').toggleClass("showMe");

          myFunction1(dohNumbers, thisID, `${cOrD}New`);


  });

//   document.querySelector(".dropdownCon").addEventListener('click', () => {
//     if (document.querySelector(".dropdownCon").classList.contains('show')) {
//       document.querySelector(".dropdownCon").classList.remove('show');
//       document.querySelector(".dropdownItems").classList.remove('show');
//       document.querySelector(".dropdownCon .fa-caret-down").classList.add('show');
//       document.querySelector(".dropdownCon .fa-caret-up").classList.remove('show');
//     } else {
//       document.querySelector(".dropdownCon").classList.add('show');
//       document.querySelector(".dropdownItems").classList.add('show');
//       document.querySelector(".dropdownCon .fa-caret-up").classList.add('show');
//       document.querySelector(".dropdownCon .fa-caret-down").classList.remove('show');
//     }
//
// });

// document.querySelectorAll(".county").forEach(el => el.addEventListener('click', () => {
//   document.querySelectorAll(".county").forEach(el => el.classList.remove('active'));
//   document.querySelector(".dropdownItems").classList.remove('show');
//   document.querySelector(".dropdownCon").classList.remove('show');
//   document.querySelector(".dropdownCon .fa-caret-up").classList.remove('show');
//   document.querySelector(".dropdownCon .fa-caret-down").classList.add('show');
//   el.classList.add('active');
//   var county = el.getAttribute('data-county');
//   var countyWSpace = county.replace(/_/g, ' ');
//   var caseOrDeath = document.querySelector('input[name="toggleCounty2"]:checked').value;
//
//   document.getElementById("fillCounty").innerHTML = (county === "New" ? "All" : countyWSpace);
//
//
//   let dataSet2 = document.querySelector('input[name="toggleCounty2"]:checked').getAttribute('data-type');
//   dataSet2  = 'assets/' + dataSet2 + day_var + '.csv';
//   // console.log(dataSet2);
//
//   myFunction1(dohNumbers, `${caseOrDeath}`, `${county}`);
//
// }));


// window.onresize = function(event) {
//   myFunction1(dohNumbers, "casesCounty3", "CasesNew");
// };


myFunction1(dohNumbers, "casesCounty3", "CasesNew");




} else {}

if($('#countyHotSpots').length >0 ){

  $('#date').empty().text(dateNew);

var hotSpots = window.case_dataHotSpots;

var countyMapGraphic = document.getElementById("HotSpotsMap");

var svgCounty = d3.select("#svg3071"),
      gCounty = svgCounty.append("g");


var unnCases = 0;
var total_state = 0;
var total_rate_state = 0;
hotSpots.forEach(function (arrayItem) {
  unnCases = (arrayItem.County === "Unassigned") ? arrayItem.total_count : unnCases;
  total_state = (arrayItem.County === "Statewide") ? arrayItem.total_count : total_state;
  total_rate_state = (arrayItem.County === "Statewide") ? arrayItem.seven_day_rate : total_rate_state;
});


$('.unassigned.cases.casesPop span').empty().append(commaFormat(unnCases));


// var fortnightAway = new Date(Date.now() - 12096e5);
//
// function getSaturday(d) {
//   d = new Date(d);
//   var day = d.getDay();
//   console.log(d.getDate() - day);
//
//   var diff = d.getDate() - day + (day == 0 ? -7:-1); // adjust when day is sunday
//   return new Date(d.setDate(diff));
// }
//
// function getSunday(d) {
//   d = new Date(d);
//   var day = d.getDay();
//   var diff = d.getDate() - day + (day == 0 ? -6:0); // adjust when day is sunday
//   return new Date(d.setDate(diff));
// }
//
// var sunday = getSunday(new Date());
// var endSaturday = getSaturday(new Date());
// var begSunday = new Date(sunday - 12096e5);
//
// var begMonth = months[begSunday.getMonth()];
// var begDay = +(begSunday.getDate());
//
// var endMonth = months[endSaturday.getMonth()];
// var endDay = +(endSaturday.getDate());
//
// $('#date-range').empty().append(begMonth + " " + begDay + " - " + endMonth + " " + endDay);
//
// console.log(begDay);
// console.log(endDay);

var countyMap = document.getElementById("svg3071");
var counties = countyMap.getElementsByClassName("county");
let caseTotals = 0;

for (let i = 0; i < counties.length; i++) {
    var countyName = counties[i].id;
    var match_name = countyName.split('_').join(' ');
    match_name = match_name + " County";
    // console.log(match_name);



    var case_value = 0;
    var popAdjCase = 0;


    //
    // var popAdjCase = (case_value / countyPop) * 10000;
    // popAdjCase = popAdjCase.toFixed(1);

    hotSpots.forEach(function (arrayItem) {
      popAdjCase = (arrayItem.County === match_name) ? arrayItem.seven_day_rate : popAdjCase;

      // console.log(arrayItem.County + " " + case_value);
    });

    var countyObj = county_pops[i];
    var countyPop = countyObj["pop_2020"];
    case_value = Math.round((countyPop / 100000) * popAdjCase);


    // caseTotals = caseTotals + case_value;

    var bbox = d3.select("#" + countyName).node().getBBox();



    let dataset = {
      cases: case_value,
      casesPop: popAdjCase,
      // casesPop: popAdjCase,
    };

    counties[i].numbers = dataset;
         var centroid = [
             bbox.x + bbox.width/2,
             bbox.y + bbox.height/2
         ];

         var pushVar = 0;

         if (countyName === "Walla_Walla") { pushVar =  40; };
         if (countyName === "Garfield") { pushVar =  -20; };
         if (countyName === "Columbia") { pushVar =  10; };

         countyName = countyName.replace(/_/g, ' ');

         var circle = svgCounty.selectAll('g').append('text')
          .attr("class", "covidNum alwaysActive")
          .attr("font-weight","bold")
          .attr("text-anchor", "middle")
          .html(function () {
           return ("<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar) + "'>" + countyName + "</tspan>");
          });

        var circleCases = svgCounty.selectAll('g').append('text')
         .attr("class", "covidNum cases")
         .attr("font-weight","bold")
         .attr("text-anchor", "middle")
         .html(function () {
          return ("<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + commaFormat(case_value) + "</tspan>");
         });

         // var circleAdjCases = svgCounty.selectAll('g').append('text')
         //  .attr("class", "covidNum casesPop")
         //  .attr("font-weight","bold")
         //  .attr("text-anchor", "middle")
         //  .html(function () {
         //   return ( case_value > 0 ? "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + commaFormat(case_value) + "</tspan>" : "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>0</tspan>" );
         //  });


          var circleAdjCases = svgCounty.selectAll('g').append('text')
           .attr("class", "covidNum casesPop")
           .attr("font-weight","bold")
           .attr("text-anchor", "middle")
           .html(function () {
            return ( case_value > 0 ? "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>" + commaFormat(popAdjCase) + "</tspan>" : "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 20) + "'>0</tspan>" );
           });


} // for loop end







$('#casesTotal').empty().append(commaFormat(total_state));

// var num = (caseTotals) / stateTotal * 100000;
// num = num.toFixed(1);

$('#casesAdj').empty().append(total_rate_state);

var myFunction = function(chosenID) {
  document.querySelectorAll('.caseKey, .covidNum').forEach(el => el.classList.remove('active'));
  document.getElementById(chosenID).classList.add('active');
  document.querySelectorAll(`.${chosenID}`).forEach(el => el.classList.add('active'));

  colorMap(chosenID);
};

var colorMap = function(chosenColor) {
  var chosenColor_2Wks = chosenColor + "_2Wks";
  for (let i = 0; i < counties.length; i++) {
    counties[i].style.fill = "#e2e2e2";


    for (let h = 0; h < buckets[chosenColor_2Wks].length; h++) {
      let bucketArray = buckets[chosenColor_2Wks];
      let colorArray = colors[chosenColor_2Wks];

      if ( counties[i].numbers[chosenColor] >= bucketArray[h]  ) {
         counties[i].style.fill = colorArray[h];
      }
    };
  };
};

document.querySelectorAll(".radioButton1").forEach(el => el.addEventListener('click', () => myFunction(el.value)) );
 myFunction('casesPop');

} else {}
