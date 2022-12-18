class Piechart {

    constructor(svg, title, width = 500, height = 450) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.title = title;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.radius = this.width/3;
        this.legend = this.svg.append("g");

        this.svg
        .attr("width", this.width)
        .attr("height", this.height);

        this.svg
        .append("text")
        .attr("x", this.width/3)
        .attr("y", 45) 
        .style("fill", "black")
        .text(this.title);

        this.container.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
        this.init = false;
    }

    update(data,dvar) {
        const categories = [...new Set(data.map(d => d[dvar]))]
        const counts = {}
        const percentages = {}

        categories.forEach(c => {
            counts[c] = data.filter(d => d[dvar] === c).length;
            percentages[c] = counts[c] / data.length;
        })

        var arcGenerator = d3.arc().innerRadius(0).outerRadius(this.radius);

        var color = colorschemes[dvar];
        
        var pie = d3.pie()
        .value(d => d[1])
        var data_ready = pie(Object.entries(counts))

        this.inside = this.container.selectAll("paths").data(data_ready)

        this.inside
            .enter()
            .append('path')
            .merge(this.inside)
            .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius))
            .attr('fill', d => color(d.data[0]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1);

        this.inside
            .enter()
            .append('text')
            .text(d => Math.round(percentages[d.data[0]] * 1000) / 10 + "% - " + d.data[1])
            .attr("transform", d => "translate(" + arcGenerator.centroid(d) + ")")
            .style("text-anchor", "middle")
            .style("font-size", 12)
            .style("font-family","sans-serif")
            .style("font-weight","bold")
            
        if (!this.init) {

            var size = 20
            this.legend.selectAll("legendrects")
                .data(Object.keys(categories))
                .enter()
                .append("rect")
                .attr("x", this.width - this.width/5)
                .attr("y", i => 300 + i*(size+15)) 
                .attr("width", size)
                .attr("height", size)
                .style("fill", d => colorschemes[dvar](d));
            
            this.legend.selectAll("legendlabels")
                .data(Object.keys(categories))
                .enter()
                .append("text")
                .attr('class','pielabel')
                .attr("x", this.width - 100 + size*1.2)
                .attr("y", i => 300 + i*(size+15) + (size/2)) 
                .style("fill", "black")
                .text(d => categories[d])
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            this.init = true;
        } 

        this.inside.exit().remove()
    }
}