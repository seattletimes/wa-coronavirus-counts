// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var $ = require('jquery');
const d3 = require("d3");


////CHANGE ME WHEN DAY CHANGES /////
var county_counts = window.case_data["waCountyCases319"];
var county_deaths = window.case_data["waCountyDeaths319"];
var day_var = "320";
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

  var colors = ['#460900', '#5f2300', '#7a3a00', '#955017', '#b2682f', '#cf8146', '#ec9a5e', '#fdba7c', '#ffdf9f'];
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
         	 	return ( case_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + centroid[1] + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + 21) + "'>" + case_value + "</tspan>" : "");
       		 });


       		 var circleDeaths = svgCounty.selectAll('g').append('text')
       			.attr("class", "county_deaths")
       			.attr("font-weight","bold")
       			.attr("text-anchor", "middle")
       			.html(function () {
       			 return ( death_value > 0 ? "<tspan class='headerC' x='" + centroid[0] + "' y='" + centroid[1] + "'>" + countyName + "</tspan>" + "<tspan class='valueC' x='" + centroid[0] + "' y='" + (centroid[1] + 21) + "'>" + death_value + "</tspan>" : "");
       			});




       death_value > 0 ? counties[i].classList.add("deathColor") : counties[i].classList.add("noColor");
       case_value > 0 ? counties[i].classList.add("caseColor") : "";
       		 // .text( function() {
        	   //  return ( value > 0 ?  countyName );
        	   // });


  } // for loop end


  var countyCases = document.getElementsByClassName("county_cases");
  var casesColors = document.getElementsByClassName("caseColor");
  var deathColors = document.getElementsByClassName("deathColor");
  var countyDeaths = document.getElementsByClassName("county_deaths");
  var radioClick = document.getElementsByClassName("radioButton1");

  var myFunction = function() {

  		if ( document.getElementById('casesCounty').checked ) {

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
  var conWidth = $("#countyTrendGraphic").width();
  console.log(conWidth);

 var margin = {top: 20, right: 20, bottom: 30, left: 40},
     width = conWidth - margin.left - margin.right,
     height = 500 - margin.top - margin.bottom;

 var x0 = d3.scaleBand().range([0, width]);

 var x1 = d3.scaleBand();

 var y = d3.scaleLinear()
     .range([height, 0]);

 var xAxis = d3.axisBottom()
     .scale(x0);

 var yAxis = d3.axisLeft()
     .scale(y)
     .tickFormat(d3.format(".2s"));

 var color = d3.scaleOrdinal().range(
     ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

 var svg = d3.select("#barChart").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var yBegin;

 var innerColumns = {
   "column1" : ["Benton","Chelan","Clallam","Clark","Columbia","Franklin","Grant","Grays_Harbor","Island","Jefferson","King","Kitsap","Kittitas","Klickitat","Lewis","Lincoln","Mason","Pierce","Skagit","Snohomish","Spokane","Thurston","Whatcom","Yakima","Unassigned"],
 }

 d3.csv("../assets/waCountyCases320.csv").then(
  function(data) {
   var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Date"; });
   color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Date"; }));

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
       .attr("transform", function(d) { return "translate(" + x0(d.Date) + ",0)"; })
       .on("mouseover", function(d) {
         tooltip.style("display", null);

         for (const key of Object.keys(d)) {
           if (d[key] > 0) {
             var tspan1 = tooltip.select(".toolData").append("tspan");
             tspan1.html(key + ": " + d[key] );
             tspan1.attr('x', 0).attr('dy', '1em');
           } else {}
         }
       })
       .on("mouseout", function(d) {
         tooltip.selectAll("tspan").remove();
         tooltip.style("display", "none");
       });

   project_stackedbar.selectAll("rect")
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
           return "orange";
         } else if ( d.name === "Snohomish" ) {
           return "red";
         } else if ( d.name === "Unassigned" )
           return "black";
        else { return "blue"; }
      });

});

var myFunction = function(updateData) {
  console.log("im running");

  d3.csv(updateData).then(
    function(data) {

      console.log(data);

  });

}


   // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");


  var textBox = tooltip.append("g")
               .attr("transform", "translate(10,0)")

  textBox.append("text")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .style("text-anchor", "start")
          .attr("font-size", "16px")
          .attr("font-weight","bold")
          .attr("transform", "translate(10,0)")
          .attr("class","toolHeader")
          .text("County Counts");

  textBox.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .style("text-anchor", "start")
          .attr("font-size", "16px")
          .attr("transform", "translate(10,0)")
          .attr("class","toolData")
          .text("");



 var radioClick = document.getElementsByClassName("radioButton2");

 for (var i = 0; i < radioClick.length; i++) {
     var dataSet = radioClick[i].getAttribute('data-type');
     dataSet  = '../assets/' + dataSet + day_var + '.csv';
     console.log(dataSet);
     radioClick[i].addEventListener('click', myFunction(dataSet), false);
 }

 // myFunction();

} else {}
