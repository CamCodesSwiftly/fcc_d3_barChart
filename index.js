const body = document.querySelector("body");
const w = 1000;
const h = 500;
const padding = 50;
fetch(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
	.then((response) => response.json())
	.then((data) => {
		const relevantData = data.data;
		const parseDate = d3.timeParse("%Y-%m-%d");
		relevantData.forEach((d) => {
			d.date = parseDate(d[0]);
			d.gdp = +d[1];
		});
		// * SVG BASE SETUP
		const svg = d3
			.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
		// * SCALE FUNCTIONS
		console.log(d3.min(relevantData, (d) => d[0]));
		const xScale = d3
			.scaleTime()
			.domain([
				d3.min(relevantData, (d) => d.date),
				d3.max(relevantData, (d) => d.date),
			])
			.range([padding, w - padding]);
		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(relevantData, (d) => d.gdp)])
			.range([h - padding, padding]);
		// * AXES
		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);
		svg.append("g")
			.attr("transform", "translate(0," + (h - padding) + ")")
			.attr("id", "x-axis")
			.call(xAxis);
		svg.append("g")
			.attr("transform", "translate(" + padding + ", 0)")
			.attr("id", "y-axis")
			.call(yAxis);
		// * TOOLTIP
		let tooltip = d3
			.select("body")
			.data(relevantData)
			.append("div")
			.attr("id", "tooltip");
		// * GRAPH
		svg.selectAll("rect")
			.data(relevantData)
			.enter()
			.append("rect")
			.attr("id", "graph")
			.attr("x", (d) => xScale(d.date))
			.attr("y", (d) => yScale(d.gdp))
			.attr("data-date", (d) => d[0])
			.attr("data-gdp", (d) => d[1])
			.attr("width", 5)
			.attr("height", (d) => Math.abs(yScale(d[1]) - yScale(0)))
			.attr("fill", "#33adff")
			.attr("class", "bar")
			.on("mouseover", function () {
				d3.select(this).attr("fill", "white");

				const date = d3.select(this).attr("data-date");
				const gdp = d3.select(this).attr("data-gdp");
				tooltip.attr("data-date", date);
				tooltip.transition().duration(200).style("opacity", 0.7);
				// prettier-ignore
				return tooltip
				.html("<div id='tooltip-content'><p id='date'>"+ date + "</p><p id='dollars'>$" + gdp +" Billion</p></div>")
				.style("left", (event.pageX + 50) + "px")
				.style("top","400px");
			})
			.on("mouseout", function () {
				d3.select(this).attr("fill", "#33adff");
				tooltip.transition().duration(200).style("opacity", 0);
			});
	});
