function updatePiechart(data) {
    speciespiechart.update(data,'species');
    sexpiechart.update(data,'sex');
}

// Fetching the dataset
var df = d3.csv("https://raw.githubusercontent.com/alvaroqsaldanha/palmerpenguinsinfovis/main/data/penguins_prep.csv")
    .then( data => {
    console.log(data[0])
    
    //  Initialization of components
    speciespiechart = new piechart("#speciespiechart")
    sexpiechart = new piechart("#sexpiechart")
    speciespiechart.initialize();
    sexpiechart.initialize();
    updatePiechart(data);
    
    });







