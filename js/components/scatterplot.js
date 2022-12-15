class Scatterplot {
    margin = {
        top: 50, right: 100, bottom: 40, left: 50
    }

    constructor(svg, tooltip, data, width = 300, height = 300) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;
        this.tooltip = tooltip;
        this.handlers = {};
        this.addedData = 0;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");
        this.xAxisLabel = this.svg.append("g");
        this.yAxisLabel = this.svg.append("g");
        this.tooltip = d3.select(this.tooltip);

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.brush = d3.brush()
        .extent([[0, 0], [this.width, this.height]])
        .on("start brush", (event) => { 
            this.brushCircles(event);
        })

        this.init = false;
    }

    update(xVar, yVar) {
        this.container.call(this.brush);
        let data = this.data;
        this.xVar = xVar;
        this.yVar = yVar;

        this.xScale.domain(d3.extent(this.data, d => d[xVar])).range([0, this.width]);
        this.yScale.domain(d3.extent(this.data, d => d[yVar])).range([this.height, 0]);
        const categories = [...new Set(data.map(d => d['species']))];

        this.circles = this.container.selectAll("circle")
            .data(data)
            .join("circle")
            .on("mouseover", (e, d) => {
                this.tooltip.select(".tooltip-inner")
                    .html(`${this.xVar}: ${d[this.xVar]}<br />${this.yVar}: ${d[this.yVar]}`);
                
            Popper.createPopper(e.target, this.tooltip.node(), {
                placement: 'top',
                modifiers: [
                    {
                            name: 'arrow',
                            options: {
                                element: this.tooltip.select(".tooltip-arrow").node(),
                            },
                        },
                    ],
                });
                this.tooltip.style("display", "block");
            })
            .on("mouseout", (d) => {
                this.tooltip.style("display", "none");
            });

        this.circles
            .transition()
            .attr("cx", d => this.xScale(d[xVar]))
            .attr("cy", d => this.yScale(d[yVar]))
            .attr("fill", d => colorschemes['species'](d['species']))
            .attr("r", 3)

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

        this.xAxisLabel
        .attr('transform', `translate(0, ${this.height - this.margin.top - this.margin.bottom})`);

        const labels = document.getElementsByClassName("axislabel");
        if (labels.length > 0) {
            for (let i = 0; i < labels.length; i++)
                labels[i].textContent = " ";
        }

        this.xAxisLabel.append('text')
        .attr('class', 'axislabel')
        .attr('x', this.width / 2)
        .attr('y', this.height / 2 + 20)
        .attr('font-size',12)
        .text(xVar);

        this.yAxisLabel.append('text')
        .attr('class', 'axislabel')
        .attr('x', -200)
        .attr('y', 10)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .attr('font-size',12)
        .text(yVar);

        if (!this.init) {
            var size = 20
            this.legend.selectAll("legendrects")
            .data(Object.keys(categories))
            .enter()
            .append("rect")
                .attr("x", this.width + 55)
                .attr("y", i => 100 + i*(size+5)) 
                .attr("width", size)
                .attr("height", size)
                .style("fill", d => colorschemes['species'](d));
            
            this.legend.selectAll("legendlabels")
            .data(Object.keys(categories))
            .enter()
            .append("text")
                .attr("x", this.width + 55 + size*1.2)
                .attr("y", i => 100 + i*(size+5) + (size/2)) 
                .style("fill", "black")
                .text(d => categories[d])
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            this.init = true;
        }
    }

    addData(feature) {
        this.data.push(feature);
        this.addedData++;
    }

    removeNewData() {
        while (this.addedData != 0) {
            this.data.pop();
            this.addedData--;
        }
    }

    isBrushed(d, selection) {
        let [[x0, y0], [x1, y1]] = selection; 

        let x = this.xScale(d[this.xVar]);
        let y= this.yScale(d[this.yVar]);
        return x0 <= x && x <= x1 && y0 <= y && y <= y1
    }

    brushCircles(event) {
        let selection = event.selection;

        this.circles.classed("brushed", d => this.isBrushed(d, selection));

        if (this.handlers.brush)
            this.handlers.brush(this.data.filter(d => this.isBrushed(d, selection)));
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }


}