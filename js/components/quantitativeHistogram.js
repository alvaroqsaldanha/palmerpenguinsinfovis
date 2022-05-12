class QuantitativeHistogram {
    margin = {
        top: 50, right: 10, bottom: 40, left: 40
    }

    constructor(svg, xVar, padding = 0, width = 300, height = 300) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.padding = padding;
        this.xVar = xVar;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(data, catVars) {

        var xVar = this.xVar;
        var columndata = data.map(d =>  d[xVar])
        let max = d3.max(columndata)
        let min = d3.min(columndata)
        var x = d3.scaleLinear().domain([min,max]).range([0, this.width]);
        this.container.append("g").attr("transform", "translate(0," + this.height + ")").call(d3.axisBottom(x));

        var histogram = d3.histogram()
        .value(d => d[xVar]) 
        .domain(x.domain())  
        .thresholds(x.ticks(30)); 
  
        var bins1 = histogram(data.filter( function(d){return d.species === "Gentoo"}));
        var bins2 = histogram(data.filter( function(d){return d.species === "Adelie"}));

        var height = this.height;

        var y = d3.scaleLinear().range([height, 0]);
        y.domain([0, d3.max(bins1, function(d) { return d.length; })]);   
        this.container.append("g").call(d3.axisLeft(y));

        this.container.selectAll("rect")
        .data(bins1)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
        .style("opacity", 0.6)

        this.container.selectAll("rect2")
            .data(bins2)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1  ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#404080")
                .style("opacity", 0.6)
        
    }

}