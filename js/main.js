// Defining the colors to be used for each species, island and quantitative attribute on the visualizations.  

speciescolorschemes = {'Adelie':"#FF6A00",'Gentoo':"#057276",'Chinstrap':"#C75ECB"};
islandcolorschemes = {'Torgersen':"#FC766AFF",'Dream':"#faea37",'Biscoe':"#184A45FF"};
sexcolorschemes = {'male':"#3477eb",'female':"#ff4a89",'other':"lightgrey"};
colorspecies = d3.scaleOrdinal()
.domain(Object.keys(speciescolorschemes))
.range(Object.values(speciescolorschemes));
colorislands = d3.scaleOrdinal()
.domain(Object.keys(islandcolorschemes))
.range(Object.values(islandcolorschemes));
colorsex = d3.scaleOrdinal()
.domain(Object.keys(sexcolorschemes))
.range(Object.values(sexcolorschemes));
colorschemes = {'species': colorspecies, 'island': colorislands, 'sex': colorsex};

// Functions to update the visualizations.

function updatePiechart(data,dvar) {
    var filtereddata = data;
    d3.select("h2").text(dvar);
    d3.select(".overviewbt").attr("style","background-color: ##47a2d6");
    d3.selectAll(".islandselect").attr("style","background-color: ##47a2d6");
    if (dvar != "Archipelago Overview") {
        dvar = dvar.split(" ")[0];
        d3.select(".overviewbt").attr("style","background-color:" + colorschemes['island'](dvar));
        d3.selectAll(".islandselect").attr("style","background-color:" + colorschemes['island'](dvar));
        filtereddata = data.filter(row => {
            return row['island'] == dvar;
        });
    }
    speciespiechart.update(filtereddata,'species');
    sexpiechart.update(filtereddata,'sex');
} 


function updateParallelCoordinates(brushedData, data) {
    let cVar = d3.select("input[type=radio][name=pc-encoding]:checked").property("value");
    parallelcoordinates.update(brushedData && brushedData.length > 0 ? brushedData : data, cVar);
}
    
function updateHistograms(brushedData, data) {
    specieshistogram.update(brushedData && brushedData.length > 0 ? brushedData : data, "species");
    islandhistogram.update(brushedData && brushedData.length > 0 ? brushedData : data, "island");
}

function updateScatterplot() {
    let xVar = d3.select("input[type=radio][name=xs-encoding]:checked").property("value");
    let yVar = d3.select("input[type=radio][name=y-encoding]:checked").property("value");
    correlationscatterplot.update(xVar, yVar);
}

function updateQuantitativeHistograms(data) {
    quantitativehistogram1.update(data,['Adelie','Gentoo','Chinstrap']);
    quantitativehistogram2.update(data,['Adelie','Gentoo','Chinstrap']);
    quantitativehistogram3.update(data,['Adelie','Gentoo','Chinstrap']);
    quantitativehistogram4.update(data,['Adelie','Gentoo','Chinstrap']);
}

// Initialization.

// Fetching the dataset
var df = d3.csv("https://raw.githubusercontent.com/alvaroqsaldanha/palmerpenguinsinfovis/main/data/penguins_prep.csv")
    .then( data => {
    
    //  Initialization of components
    speciespiechart = new Piechart("#speciespiechart", "Species Distribution")
    sexpiechart = new Piechart("#sexpiechart", "Gender Distribution")
    speciespiechart.initialize();
    sexpiechart.initialize();
    updatePiechart(data,'Archipelago Overview');
    
    d3.select("#Whole").on("click",() => {
        updatePiechart(data, 'Archipelago Overview');
    });
    d3.select("#Dream").on("click",() => {
        updatePiechart(data, 'Dream Island');
    });
    d3.select("#Torgersen").on("click",() => {
        updatePiechart(data, 'Torgersen Island');
    });
    d3.select("#Biscoe").on("click",() => {
        updatePiechart(data, 'Biscoe Island');
    });

    correlationscatterplot = new Scatterplot("#scatterplot",data);
    correlationscatterplot.initialize();
    updateScatterplot();
    d3.selectAll("input[type=radio][name=xs-encoding]").on("change", updateScatterplot);
    d3.selectAll("input[type=radio][name=y-encoding]").on("change", updateScatterplot);

    brushedData = null;
    specieshistogram = new Histogram("#specieshistogram",0.3);
    specieshistogram.initialize();
    parallelcoordinates = new Parallelcoordinates("#parallelcoordinates",data,['flipper_length_mm','bill_length_mm','bill_depth_mm','body_mass_g']);
    parallelcoordinates.initialize();  
    islandhistogram = new Histogram("#islandhistogram",0.3);
    islandhistogram.initialize();

    correlationscatterplot.on("brush",  (brushedItems) => { 
        brushedData = brushedItems;
        updateHistograms(brushedData,data);
        updateParallelCoordinates(brushedData,data);
    })    

    updateHistograms(brushedData,data);
    updateParallelCoordinates(brushedData,data);
    d3.selectAll("input[type=radio][name=pc-encoding]").on("change", () => {
        updateParallelCoordinates(brushedData,data);
    });

    quantitativehistogram1 = new QuantitativeHistogram("#quantitativehistogram1","flipper_length_mm");
    quantitativehistogram1.initialize();
    quantitativehistogram2 = new QuantitativeHistogram("#quantitativehistogram2","bill_length_mm");
    quantitativehistogram2.initialize();
    quantitativehistogram3 = new QuantitativeHistogram("#quantitativehistogram3","bill_depth_mm");
    quantitativehistogram3.initialize();
    quantitativehistogram4 = new QuantitativeHistogram("#quantitativehistogram4","body_mass_g");
    quantitativehistogram4.initialize();
    updateQuantitativeHistograms(data);

    var legend = d3.select("#quantitativelegend");
    legend.append("circle").attr("cx",90).attr("cy",30).attr("r", 6).style("fill", colorschemes['species']('Adelie'))
    legend.append("circle").attr("cx",90).attr("cy",60).attr("r", 6).style("fill", colorschemes['species']('Gentoo'))
    legend.append("circle").attr("cx",90).attr("cy",90).attr("r", 6).style("fill", colorschemes['species']('Chinstrap'))
    legend.append("text").attr("x", 100).attr("y", 30).text("Adelie").style("font-size", "15px").attr("alignment-baseline","middle")
    legend.append("text").attr("x", 100).attr("y", 60).text("Gentoo").style("font-size", "15px").attr("alignment-baseline","middle")
    legend.append("text").attr("x", 100).attr("y", 90).text("Chinstrap").style("font-size", "15px").attr("alignment-baseline","middle")
    });
