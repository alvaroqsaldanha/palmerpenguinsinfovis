class Histogram {
    margin = {
        top: 50, right: 10, bottom: 40, left: 40
    }

    constructor(svg, padding, title, width = 300, height = 300) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.padding = padding;
        this.title = title;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.svg.append("text")
        .attr("x", this.width/2 + this.width/6 )
        .attr("y", this.height / 8)
        .style("text-anchor", "middle")
        .text(this.title);
    }

    update(data, xVar) {
        const categories = [...new Set(data.map(d => d[xVar]))]
        const counts = {}

        categories.forEach(c => {
            counts[c] = data.filter(d => d[xVar] === c).length;
        })

        this.xScale.domain(categories).range([0, this.width]).padding(this.padding);
        this.yScale.domain([0, d3.max(Object.values(counts))]).range([this.height, 0]);

        this.container.selectAll("rect")
            .data(categories)
            .join("rect")
            .attr("x", d=>this.xScale(d))
            .attr("y", d=>this.yScale(counts[d]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d=>this.height-this.yScale(counts[d]))
            .attr("fill", d => colorschemes[xVar](d))

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));
    }
}