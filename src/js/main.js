// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var $ = require('jquery');
const d3 = require("d3");


////CHANGE ME WHEN DAY CHANGES /////
var county_counts = window.case_data["waCountyCases324"];
var county_deaths = window.case_data["waCountyDeaths324"];
var day_var = "324";
/////////


if($('#countyMapGraphic').length >0 ){
  var countyMapGraphic = document.getElementById("countyMapGraphic");
  var lastest_day = county_counts.length - 1;
      lastest_day = county_counts[lastest_day];

  var lastest_deaths = county_deaths.length - 1;
      lastest_deaths = county_deaths[lastest_deaths];

  var svgCounty = d3.select("#svg3071"),
        gCounty = svgCounty.append("g");

  console.log(lastest_deaths);

  var countyMap = document.getElementById("svg3071");
  var counties = countyMap.getElementsByClassName("county");

  for (var i = 0; i < counties.length; i++) {
      var countyName = counties[i].id;
      var case_value = lastest_day[countyName];
      var death_value = lastest_deaths[countyName];
      var bbox = d3.select("#" + countyName).node().getBBox();

           var centroid = [
               bbox.x + bbox.width/2,
               bbox.y + bbox.height/2
           ];

       		var circle = svgCounty.selectAll('g').append('text')
           .attr("class", "county_cases")
       		 .attr("font-weight","bold")
       		 .attr("text-anchor", "middle")
       		 .html(function () {
            countyName = countyName.replace(/_/g, ' ');
            var pushVar = (countyName === "Walla Walla") ? 40 : 0;
            console.log(pushVar);
         	 	return ( case_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar) + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + case_value + "</tspan>" : "");
       		 });


       		 var circleDeaths = svgCounty.selectAll('g').append('text')
       			.attr("class", "county_deaths")
       			.attr("font-weight","bold")
       			.attr("text-anchor", "middle")
       			.html(function () {
             countyName = countyName.replace(/_/g, ' ');
             var pushVar = (countyName === "Walla Walla") ? 40 : 0;
       			 return ( death_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar)  + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + pushVar + 25) + "'>" + death_value + "</tspan>" : "");
       			});




       death_value > 0 ? counties[i].classList.add("deathColor") : counties[i].classList.add("noColor");
       case_value > 0 ? counties[i].classList.add("caseColor") : "";



  } // for loop end


  var countyCases = document.getElementsByClassName("county_cases");
  var casesColors = document.getElementsByClassName("caseColor");
  var deathColors = document.getElementsByClassName("deathColor");
  var countyDeaths = document.getElementsByClassName("county_deaths");
  var radioClick = document.getElementsByClassName("radioButton1");

  var myFunction = function() {

  		if ( document.getElementById('casesCounty').checked ) {

        document.getElementById('unassigned').style.visibility = "inherit";

  			for (i = 0; i < countyCases.length; i++) {
  					 countyCases[i].style.display = "block";
  			}
  			for (i = 0; i < casesColors.length; i++) {
  					 casesColors[i].style.fill = "#D8894E";
  			}
  			for (i = 0; i < countyDeaths.length; i++) {
  					 countyDeaths[i].style.display = "none";
  			}

  		} else {
        document.getElementById('unassigned').style.visibility = "hidden";


  			for (i = 0; i < countyCases.length; i++) {
  					 countyCases[i].style.display = "none";
  			}
  			for (i = 0; i < casesColors.length; i++) {
  					 casesColors[i].style.fill = "#e2e2e2";
  			}
  			for (i = 0; i < deathColors.length; i++) {
  					 deathColors[i].style.fill = "#D15959";
  			}
  			for (i = 0; i < countyDeaths.length; i++) {
  					 countyDeaths[i].style.display = "block";
  			}
  		}

  }

   for (var i = 0; i < radioClick.length; i++) {
       radioClick[i].addEventListener('click', myFunction, false);
   }

   myFunction();

} else {}








 ///////////////////////////////////



if($('#countyTrendGraphic').length >0 ){
  var conWidth = $("#barChart").width();
  var commaFormat = d3.format(',');
  var conHeight = (conWidth > 500) ? 500 : 300;


  var tooltip = d3.select(".counter .body");
  var dateBox = d3.select(".counter .head .date");

  var textBox = tooltip.append("div");
  var toolData = textBox.append("div").attr("class","toolData");


 var margin = {top: 20, right: 10, bottom: 30, left: 40},
     width = conWidth - margin.left - margin.right,
     height = conHeight - margin.top - margin.bottom;

 var x0 = d3.scaleBand().range([0, width]).padding(.05);

 var x1 = d3.scaleBand().padding(.05);

 var y = d3.scaleLinear()
     .range([height, 0]);

 var xAxis = d3.axisBottom()
     .scale(x0);

 var yAxis = d3.axisLeft()
     .scale(y);



 var svg = d3.select("#barChart").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("class","mainG")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var yBegin;

 var innerColumns = {
   "column1" : ["Adams","Benton","Chelan","Clallam","Clark","Columbia","Cowlitz","Douglas","Franklin","Grant","Grays_Harbor","Island","Jefferson","King","Kitsap","Kittitas","Klickitat","Lewis","Lincoln","Mason","Pierce","San_Juan","Skagit","Snohomish","Spokane","Stevens","Thurston","Walla_Walla","Whatcom","Whitman","Yakima","Unassigned"],
 }

 var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 var caseColors = ['#531800', '#914c14', '#d28449', '#ffc88a'];
 var deathColors = ['#4a0000', '#931f2b', '#d05858', '#ff9894'];

 d3.csv("assets/waCountyCases324.csv").then(
  function(data) {
   var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Date"; });

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

   var project_stackedbar = svg.selectAll(".project_stackedbar")
       .data(data)
     .enter().append("g")
       .attr("class", "g")
       .attr("id", function(d,i) {
        if (i === (data.length - 1)) { return "gLast" } else { return ("g" + i) };
       })
       .attr("transform", function(d) { return "translate(" + x0(d.Date) + ",0)"; })
       .style("cursor","pointer")
       .on("click", function(d) {
         toolData.selectAll("div").remove();
         clickedDate = d.Date;
         clickedDate = clickedDate.split("/");
         var clickedMonth = parseInt(clickedDate[0]) - 1;

         dateBox.text(" - " + months[clickedMonth] + " " + clickedDate[1]);

         // console.log( this );
         d3.selectAll('.g').style("opacity","0.5");
         d3.select(this).style("opacity","1");

         for (const key of Object.keys(d)) {
           if (d[key] > 0) {
             var tspan1 = tooltip.select(".toolData").append("div").attr("class","entry");
             var countyName = key;
             countyName = countyName.replace(/_/g, ' ');
             var countyCount = commaFormat(d[key]);
             var colorKey;

             if (countyName === "King") {
               colorKey = "<span class='colorKey KingCase'></span>";
             } else if ( countyName === "Snohomish" ) {
               colorKey = "<span class='colorKey SnoCase'></span>";
             } else if ( countyName === "Unassigned" ) {
               colorKey = "<span class='colorKey UnnaCase'></span>";
            } else if ( countyName === "total" ) {
              countyName = "Total";
              colorKey = "";
            } else { colorKey = "<span class='colorKey elseCase'></span>"; }

             tspan1.html(colorKey + "<span class='count'>" + countyName + ": " + countyCount + "</span>" );
             tspan1.attr('x', 0).attr('y', 6);
           } else {}
         }
       });


   var bars = project_stackedbar.selectAll("rect")
       .data(function(d) { return d.columnDetails; })
       .enter().append("rect")
       .attr("width", x1.bandwidth())
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
         if (d.name === "King") {
           return caseColors[0];
         } else if ( d.name === "Snohomish" ) {
           return caseColors[1];
         } else if ( d.name === "Unassigned" ) {
           return caseColors[3];
        } else { return caseColors[2]; }
      })
      .style("stroke", function(d) {
        if (d.name === "King") {
          return caseColors[0];
        } else if ( d.name === "Snohomish" ) {
          return caseColors[1];
        } else if ( d.name === "Unassigned" ) {
          return caseColors[3];
       } else { return caseColors[2]; }
     });



     $( document ).ready(function() {
         console.log( "ready!" );
         d3.select('#gLast').dispatch('click');

     });




});



var myFunction = function(updateData, idClicked) {

  d3.csv(updateData).then(
    function(data) {

      var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Date"; });

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

            d3.selectAll('.g').style("opacity","0.5");
            d3.select(this).style("opacity","1");

            for (const key of Object.keys(d)) {
              if (d[key] > 0) {
                var tspan1 = tooltip.select(".toolData").append("div").attr("class","entry");
                var countyName = key;
                countyName = countyName.replace(/_/g, ' ');
                var countyCount = commaFormat(d[key]);
                var colorKey;
                var colorSet = (idClicked === "casesCounty2") ? "Case" : "Death";

                if (countyName === "King") {
                  colorKey = "<span class='colorKey King" + colorSet + "'></span>";
                } else if ( countyName === "Snohomish" ) {
                  colorKey = "<span class='colorKey Sno" + colorSet + "'></span>";
                } else if ( countyName === "Unassigned" ) {
                  colorKey = "<span class='colorKey Unna" + colorSet + "'></span>";
               } else if ( countyName === "total" ) {
                 countyName = "Total";
                 colorKey = "";
               } else { colorKey = "<span class='colorKey else" + colorSet + "'></span>"; }

                tspan1.html(colorKey + "<span class='count'>" + countyName + ": " + countyCount + "</span>" );
                tspan1.attr('x', 0).attr('dy', '1em');
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
              return colorSet[1];
            } else if ( d.name === "Unassigned" ) {
              return colorSet[3];
           } else { return colorSet[2]; }
         })
         .style("stroke", function(d) {
           var colorSet = (idClicked === "casesCounty2") ? caseColors : deathColors;
           if (d.name === "King") {
             return colorSet[0];
           } else if ( d.name === "Snohomish" ) {
             return colorSet[1];
           } else if ( d.name === "Unassigned" ) {
             return colorSet[3];
          } else { return colorSet[2]; }
        });

        if (idClicked === "casesCounty2") {
          d3.select('#gLast').dispatch('click');
        } else {
          d3.select('#gLast2').dispatch('click');
        }
        // d3.select('#gLast').dispatch('click');
       //  $( ".radioButton2" ).click(function() {
       //    var thisID = $(this).attr("id");
       //    console.log(thisID);
       //    // d3.select('#gLast').dispatch('click');
       // });


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

 // myFunction("../assets/waCountyCases323.csv");

} else {}
