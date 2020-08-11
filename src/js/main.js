// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var $ = require('jquery');
const d3 = require("d3");



////CHANGE ME WHEN DAY CHANGES - FOR DAY OF DATA/////
var day_var = "88";
/////////

//// change me every month ////
var monthTicks = ["3/1", "4/1", "5/1", "6/1", "7/1","8/1"];


var commaFormat = d3.format(',');
var county_counts = window.case_data[`waCountyCases${day_var}`];
var county_deaths = window.case_data[`waCountyDeaths${day_var}`];

var county_pops = window.case_data['countyPop2020'];

let colors = {
  cases: ["#D8894E"],
  deaths: ["#D15959"],
  casesPop: ["#FFE9CF",'#ffc88a','#d28449','#914c14','#730505'],
  deathsPop: ['#ffd9d7','#ff9894','#d05858','#931f2b','#61000a']
}

let buckets = {
  cases: [1],
  deaths: [0.1],
  casesPop: [0.1, 30.1, 60.1, 90.1,120.1],
  deathsPop: [0.1, 1.1, 2.1, 3.1, 4.1]
}

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var dataMonth = day_var.slice(0, 1);
var dataDay = day_var.slice(1, 3);


dataMonth = parseInt(dataMonth) - 1;
var dateNew = months[dataMonth] + " " + dataDay;
var stateTotal = 7656200;



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

       		var circle = svgCounty.selectAll('g').append('text')
           .attr("class", "covidNum cases")
       		 .attr("font-weight","bold")
       		 .attr("text-anchor", "middle")
       		 .html(function () {
            countyName = countyName.replace(/_/g, ' ');
            var pushVar = (countyName === "Walla Walla") ? 40 : 0;
         	 	return ( case_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar) + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + commaFormat(case_value) + "</tspan>" : "");
       		 });


       		 var circleDeaths = svgCounty.selectAll('g').append('text')
       			.attr("class", "covidNum deaths")
       			.attr("font-weight","bold")
       			.attr("text-anchor", "middle")
       			.html(function () {
             countyName = countyName.replace(/_/g, ' ');
             var pushVar = (countyName === "Walla Walla") ? 40 : 0;
       			 return ( death_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + commaFormat(death_value) + "</tspan>" : "");
       			});

            var circleAdjCases = svgCounty.selectAll('g').append('text')
             .attr("class", "covidNum casesPop")
             .attr("font-weight","bold")
             .attr("text-anchor", "middle")
             .html(function () {
              countyName = countyName.replace(/_/g, ' ');
              var pushVar = (countyName === "Walla Walla") ? 40 : 0;
              return ( case_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + popAdjCase + "</tspan>" : "");
             });

             var circleAdjDeaths = svgCounty.selectAll('g').append('text')
              .attr("class", "covidNum deathsPop")
              .attr("font-weight","bold")
              .attr("text-anchor", "middle")
              .html(function () {
               countyName = countyName.replace(/_/g, ' ');
               var pushVar = (countyName === "Walla Walla") ? 40 : 0;
               return ( popAdjDeath > 0.0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + popAdjDeath + "</tspan>" : "");
              });

  } // for loop end




  $('#casesTotal').empty().append(commaFormat(caseTotals + unnCases));
  $('#deathsTotal').empty().append(commaFormat(deathTotals + unnDeaths));

  var num = (caseTotals + unnCases) / stateTotal * 10000;
  num = num.toFixed(1);
  var num2 = (deathTotals + unnDeaths) / stateTotal * 10000;
  num2 = num2.toFixed(1);

  $('#casesAdj').empty().append(num);
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


 var margin = {top: 20, right: 10, bottom: 30, left: 60},
     width = conWidth - margin.left - margin.right,
     height = conHeight - margin.top - margin.bottom;

 var x0 = d3.scaleBand().range([0, width]).padding(.05);

 var x1 = d3.scaleBand().padding(.05);

 var y = d3.scaleLinear()
     .range([height, 0]);

 var xAxis = d3.axisBottom()
     .scale(x0)
     .tickValues(monthTicks);

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

 var innerColumns = {
   "column1" : ["Adams","Asotin","Benton","Chelan","Clallam","Clark","Columbia","Cowlitz","Douglas","Ferry","Franklin","Garfield","Grant","Grays_Harbor","Island","Jefferson","King","Kitsap","Kittitas","Klickitat","Lewis","Lincoln","Mason","Okanogan","Pacific","Pend_Oreille","Pierce","San_Juan","Skagit","Skamania","Snohomish","Spokane","Stevens","Thurston","Wahkiakum","Walla_Walla","Whatcom","Whitman","Yakima","Unassigned"],
 }

 var innerColumns2 = {
   "column1" : ["New"],
 }


 var caseColors = ["#F3C882", "#E98729", "#B75317", "#7b2003", "#360d01", '#aaa'];
 var deathColors = ['#f6cac1', '#db8f87', '#ae5c5c', '#7c2f38', "#330107", '#aaa'];


 $('#date').empty().text(dateNew);


var myFunction = function(updateData, idClicked) {

  d3.csv(updateData).then(
    function(data) {

      var columnHeaders = d3.keys(data[0]).filter(function(key) { return (key !== "Date") && (key !== "New") && (key !== "Roll_avg"); });

      data.forEach(function(d) {
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

      x0.domain(data.map(function(d) { return d.Date; }));
      x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);

      y.domain([0, d3.max(data, function(d) {
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
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("id", function(d,i) {
           if (i === (data.length - 1)) {
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
            dateBox.text(" - " + months[clickedMonth] + " " + clickedDate[1]);

            var asteriskInfo = ((months[clickedMonth] === "March") && (clickedDate[1] === "25") ) ? "The state Department of Health did not provide county breakdowns this day. King, Snohomish and Pierce numbers were confirmed through the county departments. All other cases are grouped as unassigned.": "";

            d3.selectAll('.g').style("opacity","0.5");
            d3.select(this).style("opacity","1");

            for (const key of Object.keys(d)) {
              if (d[key] > 0) {
                var tspan1 = tooltip.select(".toolData").append("div").attr("class","entry");

                if ( key === "Roll_avg" || key === "New") {

                } else {

                var countyName = key;

                // console.log(countyName);
                countyName = countyName.replace(/_/g, ' ');
                var countyCount = commaFormat(d[key]);
                var colorKey;
                var colorSet = (idClicked === "casesCounty2") ? "Case" : "Death";

                if (countyName === "King") {
                  colorKey = "<span class='colorKey King" + colorSet + "'></span>";
                } else if ( countyName === "Snohomish" ) {
                  colorKey = "<span class='colorKey Sno" + colorSet + "'></span>";
                } else if ( countyName === "Yakima" ) {
                  colorKey = "<span class='colorKey Yak" + colorSet + "'></span>";
                } else if ( countyName === "Pierce" ) {
                  colorKey = "<span class='colorKey Pierce" + colorSet + "'></span>";
                } else if ( countyName === "Unassigned" ) {
                  colorKey = "<span class='colorKey Unna" + colorSet + "'></span>";
               } else if ( countyName === "total" ) {
                 countyName = "Total";
                 colorKey = "";
               } else { colorKey = "<span class='colorKey else" + colorSet + "'></span>"; }

                tspan1.html(colorKey + "<span class='count'>" + countyName + ": " + countyCount + "</span>" );
                tspan1.attr('x', 0).attr('dy', '1em');
              }
              } else {}
            }
            tooltip.selectAll(".asterisk").remove();
            var tspan2 = tooltip.append("div").attr("class","asterisk");
            tspan2.html("<span class='asteriskInfo'>" + asteriskInfo + "</span>" );
            tspan2.attr('x', 0).attr('y', 6);
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
           } else { return colorSet[4]; }
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
          } else { return colorSet[4]; }
        });

        if (idClicked === "casesCounty2") {
          d3.select('#gLast').dispatch('click');
        } else {
          d3.select('#gLast2').dispatch('click');
        }



  });

}






 var dataSet;

 $( ".radioButton2" ).click(function() {
   dataSet = this.getAttribute('data-type');
   dataSet  = 'assets/' + dataSet + day_var + '.csv';

   var thisID = $(this).attr("id");

   $('.title').toggleClass("showMe");

   myFunction(dataSet, thisID);


});


 myFunction(`assets/waCountyCases${day_var}.csv`, "casesCounty2");


} else {}

/////////////////// NEW CASES AND DEATHS CHART /////////////

if($('#newbarChart').length >0 ){



 var myFunction1 = function(updateData, idClicked) {

   d3.csv(updateData).then(
     function(data) {

       $('#graph').empty();

       var conWidth = $("#newbarChart").width();

       var conHeight = (conWidth > 500) ? 600 : 300;

      var margin = {top: 20, right: 15, bottom: 40, left: 50},
          width = conWidth - margin.left - margin.right,
          height = conHeight - margin.top - margin.bottom;

      var x0 = d3.scaleBand().range([0, width]).padding(.05);

      var x1 = d3.scaleBand().padding(.05);

      var y = d3.scaleLinear()
          .range([height, 0]);

      var xAxis = d3.axisBottom()
          .scale(x0)
          .tickValues(monthTicks);


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

       var columnHeaders = d3.keys(data[0]).filter(function(key) { return (key !== "Date") && (key == "New") && (key !== "Roll_avg") });

       data.forEach(function(d) {

         var totalCases = 0;
         var netCases = 0;
         var thisThing;

         var yColumn = new Array();
         d.columnDetails = columnHeaders.map(function(name) {
           for (ic in innerColumns2) {
             if($.inArray(name, innerColumns2[ic]) >= 0){
               if (!yColumn[ic]){
                 yColumn[ic] = 0;
               }
               yBegin = yColumn[ic];
               yColumn[ic] += +d[name];

              totalCases = totalCases + parseInt(d[name]);



              thisThing = ic;

               return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin};
             }
           }
         });

         // if (totalCases === 0) {
         //   netCases = 0;
         // } else {
         //   netCases = totalCases - prevDayData;
         //   prevDayData = totalCases;
         // }
         d.total = totalCases;
         d.column = thisThing;
       });



       x0.domain(data.map(function(d) { return d.Date; }));
       x1.domain(d3.keys(innerColumns2)).range([0, x0.bandwidth()]);

       y.domain([d3.min(data, function(d) { return d.total; }), d3.max(data, function(d) { return d.total; })]);

       svg1.selectAll(".axis").remove();

       svg1.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + (height + 15) + ")")
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
               .data(data)
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
                 return d.Roll_avg;
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

                var follow = (idClicked === "casesCounty3") ? " cases" : " deaths";
                $('.newTooltip #date').empty().append(dailyDate);
                $('.newTooltip #total').empty().append(dailyTotal + follow);
                $('.newTooltip #avg').empty().append("14-day average: " + dailyAvg);
              };

              selectBar( selID );
              $( "#right" ).css("opacity",0.1) ;



                // setTimeout(function(){
                //     $(`#${lastID}`).click();
                // },1);


                //define the line
                var valueline = d3.line()
                    .x(function(d) { return x0(d.Date) + (x0.bandwidth() / 2); })
                    .y(function(d) {
                      return y(d.Roll_avg);
                    });

                    // Add the valueline path.
                svg1.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", 2)
                    .attr("d", valueline);








         });

       }



  $( ".radioButton3" ).click(function() {
          var dataSet = this.getAttribute('data-type');
          dataSet  = 'assets/' + dataSet + day_var + '.csv';

          var thisID = $(this).attr("id");

          $('.title').toggleClass("showMe");

          myFunction1(dataSet, thisID);


  });


  window.onresize = function(event) {
    myFunction1(`assets/waCountyCases${day_var}.csv`, "casesCounty3");
  };


        myFunction1(`assets/waCountyCases${day_var}.csv`, "casesCounty3");




} else {}
