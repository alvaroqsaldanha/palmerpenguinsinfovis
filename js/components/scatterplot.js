class Scatterplot {
    margin = {
        top: 50, right: 100, bottom: 40, left: 40
    }

    constructor(svg, data, width = 300, height = 300) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;

        this.handlers = {};
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");
        this.xAxisLabel = this.svg.append("g");
        this.yAxisLabel = this.svg.append("g");

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(xVar, yVar) {
        let data = this.data;
        this.xVar = xVar;
        this.yVar = yVar;

        this.xScale.domain(d3.extent(this.data, d => d[xVar])).range([0, this.width]);
        this.yScale.domain(d3.extent(this.data, d => d[yVar])).range([this.height, 0]);
        const categories = [...new Set(data.map(d => d['species']))];

        var colorschemes = {'Adelie':"#FF6A00",'Gentoo':"#057276",'Chinstrap':"#C75ECB"};


        /*var filtereddata = {};
        categories.forEach(c => { 
            filtereddata[c] = data.filter(row => {
                return row['species'] == c;
            });
        });*/

        this.circles = this.container.selectAll("circle")
            .data(data)
            .join("circle");

        this.circles
            .transition()
            .attr("cx", d => this.xScale(d[xVar]))
            .attr("cy", d => this.yScale(d[yVar]))
            .attr("fill", d => colorschemes[d['species']])
            .attr("r", 3)

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

        const innerWidth = this.width - this.margin.left - this.margin.right;
        const innerHeight = this.height - this.margin.top - this.margin.bottom;

        this.xAxisLabel
        .attr('transform', `translate(0, ${innerHeight})`);

        var colorspecies = d3.scaleOrdinal()
        .domain(Object.keys(colorschemes))
        .range(Object.values(colorschemes));

        var xlabel = this.xAxisLabel.append('text')
        .attr('class', 'axis-label')
        .attr('x', this.width / 2)
        .attr('y', this.height / 2 + 20)
        .attr('font-size',12)
        .text("");

        xlabel
        .text(xVar);

        this.yAxisLabel.append('text')
        .attr('class', 'axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .text(yVar);

        var size = 20
        this.legend.selectAll("legendrects")
          .data(Object.keys(categories))
          .enter()
          .append("rect")
            .attr("x", this.width + 50)
            .attr("y", i => 100 + i*(size+5)) 
            .attr("width", size)
            .attr("height", size)
            .style("fill", d => colorspecies(d));
        
        this.legend.selectAll("legendlabels")
          .data(Object.keys(categories))
          .enter()
          .append("text")
            .attr("x", this.width + 50 + size*1.2)
            .attr("y", i => 100 + i*(size+5) + (size/2)) 
            .style("fill", "black")
            .text(d => categories[d])
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        this.xAxisLabel.exit().remove();

    }


}