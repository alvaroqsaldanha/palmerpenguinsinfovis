class QuantitativeHistogram {
    margin = {
        top: 50, right: 10, bottom: 40, left: 40
    }

    constructor(svg, xVar, padding = 0, width = 280, height = 280) {
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
        this.x = null;

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(data, catVars) {

        var xVar = this.xVar;
        var columndata = data.map(d =>  d[xVar])
        var overviewcalcs = {};
        let max = d3.max(columndata)
        let min = d3.min(columndata)

        overviewcalcs["avg"] = d3.mean(columndata).toFixed(2);
        overviewcalcs["high"] = max;
        overviewcalcs["low"] = min;
        overviewcalcs["median"] = d3.median(columndata).toFixed(2);
        overviewcalcs["var"] = d3.variance(columndata);
        overviewcalcs["dev"] = d3.deviation(columndata);

        var setlabels = () => {
            d3.select("h5").text("Penguin Overview " + this.xVar + ":");
            d3.select("#avgvalue").text("Average Value: " + overviewcalcs["avg"]);
            d3.select("#highvalue").text("Highest Value: " + overviewcalcs["high"]);
            d3.select("#lowvalue").text("Lowest Value: " + overviewcalcs["low"]);
            d3.select("#medianvalue").text("Median: " + overviewcalcs["avg"]);
            d3.select("#varvalue").text("Variance: " + overviewcalcs["high"]);
            d3.select("#devvalue").text("Deviation: " + overviewcalcs["low"]);
        }
        setlabels();
        this.svg.on("click", setlabels);

        this.x = d3.scaleLinear().domain([min,max]).range([0, this.width]);
        this.container.append("g").attr("transform", "translate(0," + this.height + ")").call(d3.axisBottom(this.x));

        var histogram = d3.histogram().value(d => d[xVar]).domain(this.x.domain()).thresholds(this.x.ticks(30));

        var bins = {};
        var calcs = {};
        
        catVars.forEach(element => {
            var speciesdata = data.filter(d => d.species === element);
            bins[element] = histogram(speciesdata); 
            columndata = speciesdata.map(d =>  d[xVar]);
            calcs[element] = {};
            calcs[element]["avg"] = d3.mean(columndata).toFixed(2);
            calcs[element]["high"] = d3.max(columndata);
            calcs[element]["low"] = d3.min(columndata);
            calcs[element]["median"] = d3.median(columndata).toFixed(2);
            calcs[element]["var"] = d3.variance(columndata);
            calcs[element]["dev"] = d3.deviation(columndata);
        });

        var height = this.height;

        var maxstuff = [];
        catVars.forEach(element => {
            maxstuff.push(d3.max(bins[element], d => d.length));
        })
        max = d3.max(maxstuff);

        var y = d3.scaleLinear().range([height, 0]);
        y.domain([0, max]);   
        this.container.append("g").call(d3.axisLeft(y));

        catVars.forEach(element => {
            this.container.selectAll("rect" + element)
            .data(bins[element])
            .enter()
            .append("rect")
            .on("mouseover", (e) => {
                d3.select("h5").text(element + " " + this.xVar + ":");
                d3.select("#avgvalue").text("Average Value: " + calcs[element]["avg"]);
                d3.select("#highvalue").text("Highest Value: " + calcs[element]["high"]);
                d3.select("#lowvalue").text("Lowest Value: " + calcs[element]["low"]);
                d3.select("#medianvalue").text("Median: " + calcs[element]["avg"]);
                d3.select("#varvalue").text("Variance: " + calcs[element]["high"]);
                d3.select("#devvalue").text("Deviation: " + calcs[element]["low"]);
                this.container.selectAll(".test_" + element).style("fill", "black");
            })
            .on("mouseout", (d) => {
                this.container.selectAll(".test_" + element).style("fill", colorschemes['species'](element));
            })
            .attr("class","test_" + element)
            .attr("x", 1)
            .attr("transform", d => "translate(" + this.x(d.x0) + "," + y(d.length) + ")")
            .attr("width", d => (this.x(d.x1) - this.x(d.x0) - 1) > 0 ? (this.x(d.x1) - this.x(d.x0) - 1) : 0)
            .attr("height", d => height - y(d.length))
            .style("fill", colorschemes['species'](element))
            .style("opacity", 0.6);
        }); 

        this.xAxisLabel.append('text')
        .attr('class', 'axislabel1')
        .attr('x', this.width / 2)
        .attr('y', this.height + 80)
        .attr('font-size',12)
        .text(xVar);

        this.yAxisLabel.append('text')
        .attr('class', 'axislabel1')
        .attr('x', -200)
        .attr('y', 10)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .attr('font-size',12)
        .text("Frequency");
    }

}