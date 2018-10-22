var margin = {top: 40, right: 40, bottom: 40, left: 40}
var width = 450
var height = 270

y_initial = [0]
x_initial = [""]

var y_in = y_initial
var x_in = x_initial

// Gather Categories data

var Categories = [];
for(i=0; i < document.getElementById("code_options").options.length; i++){
    Categories.push(document.getElementById("code_options").options[i].value)
};


// Gather Rework data

var Rework = ["Rework", "Not Rework"]

// Scale creation

var y_scale = d3.scaleLinear()
    .domain([0, 6])
    .range([height, 0]);

var x_scale = d3.scaleBand()
    .domain(x_in)
    .range([margin.left, width - margin.right])
    .paddingInner(0.05);

var c_scale = d3.scaleSequential(d3.interpolateRdBu)
    .domain([0, 1]);

var yAxis = d3.axisLeft(y_scale);
var xAxis = d3.axisBottom(x_scale);

// Chart background

var svg = d3.select("#chart")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("class", "chart")
    .style("background-color", "white")

// Chart creation

var chart = svg.append('g')
    .attr('width', width)
    .attr('height', height)
    .attr("transform", 'translate(' + (margin.left) + ',' + (margin.top) + ')')

// Adding data

chart.append("g")
    .selectAll("rect")
    .data(x_in)
    .enter()
    .append("rect")
    .attr("x", function(d) {
        return x_scale(d);
    })
    .attr("y", function(d, i) {
        return y_scale(y_in[i]);
    })
    .attr("height", function(d, i){
        return y_scale(0) - y_scale(y_in[i]);
    })
    .attr("width", 25)
    .style("fill", function(d, i){
        return c_scale(y_in[i]/7);
    })

// Adding axes

svg.append("g")
    .attr("transform", 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('class', 'y axis')
    .call(yAxis);

svg.append("g")
    .attr("transform", "translate(0," + (height + margin.top) + ")")
    .attr("class", "x axis")
    .call(xAxis);

// Checkbox event

$("#Category").change(function(){
    if (this.checked){
        var User = JSON.parse(document.getElementById('user-data').textContent);
        var url = "chart/"
        var Amount = [];
        $.ajax({
            url: url,
            data: {
                "X": "Categories",
                "User": User
            },
            dataType: "json",
            success: function(data) {
                var x_in = Categories;

                var x_scale = d3.scaleBand()
                    .domain(x_in)
                    .range([margin.left, width - margin.right])
                    .paddingInner(0.05);

                var xAxis = d3.axisBottom(x_scale);

                for(s in Categories){
                    Amount.push(data[Categories[s]]);
                };
                var y_in = Amount;
                var bars = chart.selectAll("rect")
                    .remove()
                    .exit()
                    .data(x_in)
                bars.enter()
                    .append("rect")
                    .attr("transform", 'translate(' + margin.left + ', 0)')
                    .attr("x", function(d) {
                        return x_scale(d);
                    })
                    .attr("y", function(d, i) {
                        return y_scale(y_in[i]);
                    })
                    .attr("height", function(d, i){
                        return y_scale(0) - y_scale(y_in[i]);
                    })
                    .attr("width", 25)
                    .style("fill", function(d, i){
                        return c_scale(y_in[i]/7);
                    })

                svg.selectAll(".x")
                    .attr("transform", "translate(0," + (height + margin.top) + ")")
                    .call(xAxis);

            },
            error: function (xhr, errorThrown){
            console.log(xhr.responseText);
            console.log(errorThrown);
            }
        })
    } else if (!this.checked) {
        var y_in = y_initial
        var x_in = x_initial
        var bars = chart.selectAll("rect")
            .remove()
            .exit()
            .data(x_in)
        bars.enter()
            .append("rect")
            .attr("transform", 'translate(' + margin.left + ', 0)')
            .attr("x", function(d) {
                return x_scale(d);
            })
            .attr("y", function(d, i) {
                return y_scale(y_in[i]);
            })
            .attr("height", function(d, i){
                return y_scale(0) - y_scale(y_in[i]);
            })
            .attr("width", 25)
            .style("fill", function(d, i){
                return c_scale(y_in[i]/7);
            })

        svg.selectAll(".x")
            .attr("transform", "translate(0," + (height + margin.top) + ")")
            .call(xAxis);
    }
})



