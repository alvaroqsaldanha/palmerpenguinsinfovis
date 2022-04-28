
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
    });
