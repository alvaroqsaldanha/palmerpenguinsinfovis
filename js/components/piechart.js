class Piechart {

    constructor(svg, width = 400, height = 400) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.radius = this.width/3;

        this.svg
        .attr("width", this.width)
        .attr("height", this.height);

        this.container.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
    }

    update(data,dvar) {
        const categories = [...new Set(data.map(d => d[dvar]))]
        const counts = {}

        categories.forEach(c => {
            counts[c] = data.filter(d => d[dvar] === c).length;
        })

        var colorschemes = {'species': colorspecies , 'sex': d3.scaleOrdinal()
        .domain(Object.keys(counts))
        .range(["#3477eb","#ff4a89","lightgrey"])};

        var color = colorschemes[dvar];

        var pie = d3.pie()
        .value(function(d) {return d[1]; })
        var data_ready = pie(Object.entries(counts))

        var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)

        this.u = this.container.selectAll("path")
                .data(data_ready)
        
        this.u
            .enter()
            .append('path')
            .merge(this.u)
            .attr('d', d3.arc()
              .innerRadius(0)
              .outerRadius(this.radius)
            )
            .attr('fill', function(d){ return(color(d.data[0])) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1);
        

        /*this.u
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d){ return d.data[0] + ": " + d.data[1]})
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", 12) */
        
    
        this.u
        .exit()
        .remove()

    }


}