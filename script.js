let buildings;
let cities;

async function load_data(url){
    let loaded_data = await d3.csv(url, d3.autoType);
    return loaded_data;
}

function filter_data(){
    let europe = cities.filter(state => state.eu == true);
    return europe;
}

function sort_data(){
    let sorted_building = buildings.sort((a, b) => b.height_ft - a.height_ft);
    return sorted_building;
}

async function scatter_plot(){
    const url = 'cities.csv';
    cities = await load_data(url);
    let europe_cities = filter_data();

    d3.select('.city-count').text("Number of Cities: " + europe_cities.length);

    const width = 700;
    const height = 550;
    const svg = d3.select('.population-plot')
		.append('svg')
        .attr('width', width)
        .attr('height', height)

    let big_cities = europe_cities.filter(cit => cit.population >= 1000000);
    let small_cities = europe_cities.filter(cit => cit.population < 1000000);

    svg.selectAll(".population-plot")
    .data(small_cities)
    .enter()
    .append("circle")
    .attr("cx", function(d){
        return d.x;
    })
    .attr("cy", function(d){
        return d.y;
    })
    .attr("r", function(d){
        return 4;
    })
    .attr("fill", "darkgreen")
    .on("mouseover", function(){
        d3.select(this).style("fill", "red");
    })
    .on("mouseout", function(){
        d3.select(this).style("fill", "darkgreen");
    })

    svg.selectAll(".population-plot")
        .data(big_cities)
        .enter()
        .append("circle")
        .attr("cx", function(d){
            return d.x;
        })
        .attr("cy", function(d){
            return d.y;
        })
        .attr("r", function(d){
            return 8;
        })
        .attr("fill", "springgreen")
        .on("mouseover", function(){
            d3.select(this).style("fill", "red");
        })
        .on("mouseout", function(){
            d3.select(this).style("fill", "springgreen");
        })

    svg.selectAll("text")
        .data(big_cities)
        .enter()
        .append("text")
        .attr("class", "data-label")
        .attr("text-anchor", "middle")
        .attr("dy", -12)
        .text(function(d){
            return d.country;
        })
        .attr("x", function(d){
            return d.x;
        })
        .attr("y", function(d){
            return d.y;
        })
        .attr("font-size", "11px")
}

async function bar_chart(){
    const url = 'buildings.csv';
    buildings = await load_data(url);
    let sorted_buildings = sort_data();

    const width = 600;
    const height = 500;
    let arr = [];
    const svg = d3.select('.building-graph')
		.append('svg')
        .attr('width', width)
        .attr('height', height)

    const svgImg = d3.select(".image-place")
        .append("svg")
        .attr("width", 320)
        .attr("height", 560)

        svgImg.selectAll("img")
        .data(sorted_buildings)
        .enter()
        .append("svg:image")
        .attr("xlink:href", "img/1.jpg")

        d3.select(".height").text("2717 ft (828 m)");
        d3.select(".city").text("Dubai");
        d3.select(".country").text("United Arab Emirates");
        d3.select(".floors").text("163");
        d3.select(".completed").text("2010");

    d3.select(".header").text("Burj Khalifa");

    svg.selectAll('bar')
        .data(sorted_buildings)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 250)
        .attr("y", function(d){
            let y = height / (sorted_buildings.length + 1) * (sorted_buildings.indexOf(d) + 1);
            arr.push(y);
            return y;
        })
        .attr("width", function(d){
            return d.height_px;
        })
        .attr("height", 30)
        .attr("fill", "navy")
        .on("mouseover", function(){
            d3.select(this).style("fill", "lightskyblue");
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function(){
            d3.select(this).style("fill", "navy");
            d3.select(this).style("cursor", "default"); 
        })
        .on("click", (event, d) =>{
            console.group(d);
            svgImg.selectAll("img")
                .data(sorted_buildings)
                .enter()
                .append("svg:image")
                .attr("xlink:href", "img/" + d.image)
            d3.select(".header").text(d.building);
            d3.select(".height").text(d.height_ft + " ft (" + d.height_m + " m)");
            d3.select(".city").text(d.city);
            d3.select(".country").text(d.country);
            d3.select(".floors").text(d.floors);
            d3.select(".completed").text(d.completed);
          });
    
    let i = 0;
    let text_label = [];
    svg.selectAll("text")
        .data(sorted_buildings)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", 0)
        .attr("y", function(d){
            let text = arr[i] + 20;
            i += 1;
            text_label.push(text);
            return text;
        })
        .text(function(d){
            return d.building;
        })
    
    let j = 0;
    svg.selectAll("endText")
        .data(sorted_buildings)
        .enter()
        .append("text")
        .attr("class", "data-label")
        .attr("fill", "white")
        .attr("x", function(d){
            return d.height_px + 250 - 58;
        })
        .attr("y", function(d){
            let end_text = text_label[j];
            j += 1;
            return(end_text);
        })
        .text(function(d){
            return (d.height_ft + " ft");
        })
}

scatter_plot();
bar_chart();