class piechart {

    constructor(svg, width = 400, height = 400) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.radius = this.width / 3;

        this.svg
        .attr("width", this.width )
        .attr("height", this.height);

        this.container.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
    }

    update(data,dvar) {
        const categories = [...new Set(data.map(d => d[dvar]))]
        const counts = {}

        categories.forEach(c => {
            counts[c] = data.filter(d => d[dvar] === c).length;
        })

        var color = d3.scaleOrdinal()
        .domain(Object.keys(counts))
        .range(d3.schemeDark2);

        var pie = d3.pie()
        .value(function(d) {return d[1]; })
        var data_ready = pie(Object.entries(counts))
      
        this.container
            .selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius)
            )
            .attr('fill', function(d){ return(color(d.data[0])) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

    }


}