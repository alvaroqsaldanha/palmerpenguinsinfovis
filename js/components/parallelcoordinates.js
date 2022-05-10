class Parallelcoordinates {
    margin = {
        top: 50, right: 100, bottom: 40, left: 50
    }

    constructor(svg, width = 300, height = 300) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.vars = ["bill_depth_mm","bill_length_mm","flipper_length_mm","body_mass_g"];
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.y = {}
        for (let i in this.vars) {
            let dim = this.vars[i]
            this.y[dim] = d3.scaleLinear()
            .domain( [0,8] ) 
            .range([this.height, 0])
        }

        this.x = d3.scalePoint()
        .range([0, this.width])
        .domain(this.vars);
    }



    update(data) {
        console.log(this.vars)
        this.container.selectAll("path")
        .data(data)
        .enter()
        .append("path")
          .attr("class", function (d) { return "line " + d.species } ) // 2 class for each line: 'line' and the group name
          .attr("d", d => d3.line()(this.vars.map(p => [this.x(p), this.y[p](d[p])])))
          .style("fill", "none" )
          .style("stroke", d => colorschemes['species'](d) )
          .style("opacity", 0.5)
    
      // Draw the axis:
      /*this.container.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(this.vars).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", d => "translate(" + this.x(d) + ")")
        // And I build the axis with the call function
        .each(d => {
            d3.select(this).call(d3.axisLeft().scale(this.y[d]))})
        // Add axis title
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function(d) { return d; })
          .style("fill", "black") */

    }

}