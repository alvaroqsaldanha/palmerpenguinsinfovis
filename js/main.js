//Defining the colors to be used for each species and island on the visualizations  

speciescolorschemes = {'Adelie':"#FF6A00",'Gentoo':"#057276",'Chinstrap':"#C75ECB"};
islandcolorschemes = {'Torgersen':"#FC766AFF",'Dream':"#faea37",'Biscoe':"#184A45FF"};
colorspecies = d3.scaleOrdinal()
.domain(Object.keys(speciescolorschemes))
.range(Object.values(speciescolorschemes));
colorislands = d3.scaleOrdinal()
.domain(Object.keys(islandcolorschemes))
.range(Object.values(islandcolorschemes));
colorschemes = {'species': colorspecies, 'island': colorislands};

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
    parallelcoordinates = new Parallelcoordinates("#parallelcoordinates");
    parallelcoordinates.initialize();  
    parallelcoordinates.update(data);
    islandhistogram = new Histogram("#islandhistogram",0.3);
    islandhistogram.initialize();

    correlationscatterplot.on("brush",  (brushedItems) => { 
        brushedData = brushedItems;
        updateHistograms(brushedData,data);
    })    

    updateHistograms(brushedData,data);

    quantitativehistogram1 = new QuantitativeHistogram("#quantitativehistogram1","flipper_length_mm");
    quantitativehistogram1.initialize();
    quantitativehistogram2 = new QuantitativeHistogram("#quantitativehistogram2","flipper_length_mm");
    quantitativehistogram2.initialize();
    quantitativehistogram3 = new QuantitativeHistogram("#quantitativehistogram3","flipper_length_mm");
    quantitativehistogram3.initialize();
    quantitativehistogram4 = new QuantitativeHistogram("#quantitativehistogram4","flipper_length_mm");
    quantitativehistogram4.initialize();
    updateQuantitativeHistograms(data);
    });
