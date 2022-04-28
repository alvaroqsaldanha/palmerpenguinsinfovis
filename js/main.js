colorschemes = {'Adelie':"#FF6A00",'Gentoo':"#057276",'Chinstrap':"#C75ECB"};
colorspecies = d3.scaleOrdinal()
.domain(Object.keys(colorschemes))
.range(Object.values(colorschemes));

function updatePiechart(data) {
    let dvar = d3.select("input[type=radio][name=x-encoding]:checked").property("value");
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
    speciespiechart = new piechart("#speciespiechart")
    sexpiechart = new piechart("#sexpiechart")
    speciespiechart.initialize();
    sexpiechart.initialize();
    updatePiechart(data);
    d3.selectAll("input[type=radio][name=x-encoding]").on("change", function () {
        updatePiechart(data);
      });

    correlationscatterplot = new Scatterplot("#scatterplot",data);
    correlationscatterplot.initialize();
    updateScatterplot();
    d3.selectAll("input[type=radio][name=xs-encoding]").on("change", updateScatterplot);
    d3.selectAll("input[type=radio][name=y-encoding]").on("change", updateScatterplot);

    brushedData = null;
    specieshistogram = new Histogram("#specieshistogram");
    specieshistogram.initialize();

    correlationscatterplot.on("brush",  (brushedItems) => { 
        brushedData = brushedItems;
        updateHistograms(brushedData,data);
    })    

    updateHistograms(brushedData,data);
    });
