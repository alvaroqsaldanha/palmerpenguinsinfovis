//Defining the colors to be used for each species and island on the visualizations  

speciescolorschemes = {'Adelie':"#FF6A00",'Gentoo':"#057276",'Chinstrap':"#C75ECB"};
islandcolorschemes = {'Torgersen':"#FC766AFF",'Dream':"#B0B8B4FF",'Biscoe':"#184A45FF"};
colorspecies = d3.scaleOrdinal()
.domain(Object.keys(speciescolorschemes))
.range(Object.values(speciescolorschemes));
colorislands = d3.scaleOrdinal()
.domain(Object.keys(islandcolorschemes))
.range(Object.values(islandcolorschemes));
colorschemes = {'species': colorspecies, 'island': colorislands};

function updatePiechart(data,ivar) {
    dvar = ivar;
    var filtereddata = data;
    if (dvar.length > 1) {
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

// Fetching the dataset
var df = d3.csv("https://raw.githubusercontent.com/alvaroqsaldanha/palmerpenguinsinfovis/main/data/penguins_prep.csv")
    .then( data => {
    
    //  Initialization of components
    speciespiechart = new Piechart("#speciespiechart")
    sexpiechart = new Piechart("#sexpiechart")
    speciespiechart.initialize();
    sexpiechart.initialize();
    updatePiechart(data,'');
    
    d3.select("#Whole").on("click",() => {
        updatePiechart(data, '');
    });
    d3.select("#Dream").on("click",() => {
        updatePiechart(data, 'Dream');
    });
    d3.select("#Torgersen").on("click",() => {
        updatePiechart(data, 'Torgersen');
    });
    d3.select("#Biscoe").on("click",() => {
        updatePiechart(data, 'Biscoe');
    });

    correlationscatterplot = new Scatterplot("#scatterplot",data);
    correlationscatterplot.initialize();
    updateScatterplot();
    d3.selectAll("input[type=radio][name=xs-encoding]").on("change", updateScatterplot);
    d3.selectAll("input[type=radio][name=y-encoding]").on("change", updateScatterplot);

    brushedData = null;
    specieshistogram = new Histogram("#specieshistogram");
    specieshistogram.initialize();
    parallelcoordinates = new Parallelcoordinates("#parallelcoordinates");
    parallelcoordinates.initialize();  
    parallelcoordinates.update(data);
    islandhistogram = new Histogram("#islandhistogram");
    islandhistogram.initialize();

    correlationscatterplot.on("brush",  (brushedItems) => { 
        brushedData = brushedItems;
        updateHistograms(brushedData,data);
    })    

    updateHistograms(brushedData,data);
    });
