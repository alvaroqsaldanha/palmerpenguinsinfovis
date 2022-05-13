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
        this.xAxisLabel = this.svg.append("g");
        this.yAxisLabel = this.svg.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    zoomIn(ev,hist) {
        console.log(ev.path[0].className.baseVal)
        hist.update({},['Gentoo']);
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

        var bins = {}
        
        catVars.forEach(element => {
            bins[element] = histogram(data.filter( function(d){return d.species === element}));
        });

        var height = this.height;

        var maxstuff = []
        catVars.forEach(element => {
            maxstuff.push(d3.max(bins[element], d => d.length))
        })
        max = d3.max(maxstuff);

        var y = d3.scaleLinear().range([height, 0]);
        y.domain([0, max]);   
        this.container.append("g").call(d3.axisLeft(y));

        var count = 0

        catVars.forEach(element => {
            this.container.selectAll("rect" + count)
            .data(bins[element])
            .enter()
            .append("rect")
            .attr("class","test_" + element)
            .attr("x", 1)
            .attr("transform", d => "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .attr("width", d => (x(d.x1) - x(d.x0) - 1) > 0 ? (x(d.x1) - x(d.x0) - 1) : 0)
            .attr("height", d => height - y(d.length))
            .style("fill", colorschemes['species'](element))
            .style("opacity", 0.6);
        });

        var svg = this;

        this.container.selectAll("rect").on("click", ev => {
            this.zoomIn(ev,svg)
        });

        this.xAxisLabel.append('text')
        .attr('class', 'axis-label')
        .attr('x', this.width / 2)
        .attr('y', this.height + 80)
        .attr('font-size',12)
        .text(xVar);

        this.yAxisLabel.append('text')
        .attr('class', 'axis-label')
        .attr('x', -200)
        .attr('y', 10)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .attr('font-size',12)
        .text("Frequency");
        
    }

}