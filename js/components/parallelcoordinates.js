class Parallelcoordinates {
    margin = {
        top: 50, right: 100, bottom: 40, left: 50
    }

    constructor(svg, data, vars, width = 300, height = 300) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.data = data;
        this.vars = vars;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.xScale = d3.scalePoint()
        .range([0, this.width])
        .domain(this.vars);

        this.yScales = {}
        this.vars.forEach(element => {
            this.yScales[element] = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d[element])) 
            .range([this.height, 0])           
        });

        this.axes = this.container.append("g");
        this.titles = this.container.append("g");
        this.lines = this.container.append("g");
        this.focusedLines = this.container.append("g");
    }

    update(brushedData, xVar) {

        this.axes.selectAll("g.axis")
        .data(this.vars)
        .join("g")
        .attr("class", "axis")
        .attr("transform", d => `translate(${this.xScale(d)}, 0)`)
        .each((d, i, nodes) => {
        d3.select(nodes[i]).call(d3.axisLeft(this.yScales[d]))
        });

        this.titles.selectAll("text")
        .data(this.vars)
        .join("text")
        .attr("transform", d => `translate(${this.xScale(d)}, 0)`)
        .text(d => d)
        .attr("text-anchor", "middle")
        .attr("font-size", ".7rem")
        .attr("dy", "-.8rem");

        let polyline = (d) => {
            return d3.line()(this.vars.map(dim => [this.xScale(dim), this.yScales[dim](d[dim])]));
        }

        this.lines
        .selectAll("path")
        .data(this.data)
        .join("path")
        .attr("d", polyline)
        .style("fill", "none")
        .style("stroke", d => colorschemes[xVar](d[xVar]))
        .style("opacity", 0.1)

        this.focusedLines
        .selectAll("path")
        .data(brushedData)
        .join("path")
        .attr("d", polyline)
        .style("fill", "none")
        .style("stroke", d => colorschemes[xVar](d[xVar]))
        .style("opacity", 1)
        
    

    }

}