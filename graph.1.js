queue()

    .defer(d3.json, "transaction.json")
    .await(makeCharts);


function makeCharts(error, transactionsData) {

    let ndx = crossfilter(transactionsData);

    let makeMyDay = d3.time.format("%d/%m/%Y").parse;
    
    transactionsData.forEach(function(d) {
        d.date = makeMyDay(d.date);
    })
    //for each date in the array, replace the string with a date object//

    let nameDim = ndx.dimension(dc.pluck("name"));

    let totalSpendPerPerson = nameDim.group().reduceSum(dc.pluck("spend"));

    let spendChart = dc.barChart("#chart-goes-here");

    let personColors = d3.scale.ordinal().range(["red", "lemonchiffon", "blue"]);

    spendChart
        .width(300)
        .height(150)
        .colorAccessor(function(d) {
            return d.key
        })
        .colors(personColors)
        .dimension(nameDim)
        .group(totalSpendPerPerson)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Person")
        .yAxis().ticks(4)

    dc.renderAll();

    let storeDim = ndx.dimension(dc.pluck("store"));

    let totalSpendPerStore = storeDim.group().reduceSum(dc.pluck("spend"));

    let storeChart = dc.barChart("#store-chart");

    storeChart
        .width(300)
        .height(150)
        .dimension(storeDim)
        .group(totalSpendPerStore)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Store")
        .elasticY(true)
        .yAxis().ticks(4)


    dc.renderAll();

    let stateDim = ndx.dimension(dc.pluck("state"));
    let totalSpendPerState = stateDim.group().reduceSum(dc.pluck("spend"));

    let stateChart = dc.pieChart("#state-chart");

    stateChart
        .width(300)
        .radius(150)
        .dimension(stateDim)
        .group(totalSpendPerState)
        .transitionDuration(1500)


    dc.renderAll();
    
    let dateDim = ndx.dimension(dc.pluck("date"));
    let totalSpendPerDate = dateDim.group().reduceSum(dc.pluck("spend"));

    
    
    let minDate = dateDim.bottom(1)[0].date;
    let maxDate = dateDim.top(1)[0].date;
    
    let lineSpend = dc.lineChart("#line-chart");
    
    
         lineSpend
        .width(1000)
        .height(300)
        .dimension(dateDim)
        .group(totalSpendPerDate)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Month")
        .transitionDuration(1500)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .yAxis().ticks(8);   


    dc.renderAll();

}
