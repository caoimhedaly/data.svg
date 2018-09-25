queue()

    .defer(d3.json, "transactions.json")
    .await(makeCharts);


function makeCharts(error, transactionsData) {

    let ndx = crossfilter(transactionsData);

    //let nameDim = ndx.dimension(function(d) {
    //  return d.name;//
    // }); //

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


    dc.renderAll();
}
