const colorClustersList = document.querySelector("#swatch-clusters");
let sbIcon = document.querySelector(".swatchbook-toggle");
let sbContainer = document.querySelector(".swatchbook-container");
let sbClusterList = document.querySelector("#swatch-clusters");
let sbList = sbContainer.querySelector("#swatchbook-list");
let pageNavEl = sbContainer.querySelector(".page-nav");

let colorClusters = [];
colorClustersList.querySelectorAll(".cluster").forEach(cluster => {
	let clusterData = { 
		name: cluster.dataset.name, 
		leadColor: JSON.parse(cluster.dataset.lead), 
		colors: [] 
	};
	colorClusters.push(clusterData);

	cluster.style.backgroundColor = `rgb(${clusterData.leadColor.join(',')})`;
});

let colorNamesList = getColorNamesList();
let namedColors = [
	{
	  "name": "100 Mph",
	  "hex": "#c93f38",
	  "rgb": {
	    "r": 201,
	    "g": 63,
	    "b": 56
	  },
	  "hsl": {
	    "h": 2.896551724137933,
	    "s": 57.31225296442687,
	    "l": 50.3921568627451
	  },
	  "luminance": 70.85364929204422
	}, 
	{
	  "name": "20000 Leagues Under the Sea",
	  "hex": "#191970",
	  "rgb": {
	    "r": 25,
	    "g": 25,
	    "b": 112
	  },
	  "hsl": {
	    "h": 240,
	    "s": 63.503649635036496,
	    "l": 26.862745098039216
	  },
	  "luminance": 20.83873974116477
	}, 
	{
	  "name": "24 Carrot",
	  "hex": "#e56e24",
	  "rgb": {
	    "r": 229,
	    "g": 110,
	    "b": 36
	  },
	  "hsl": {
	    "h": 23.005181347150263,
	    "s": 78.77551020408163,
	    "l": 51.9607843137255
	  },
	  "luminance": 94.20406337839148
	}, 
	{
	  "name": "3AM in Shibuya",
	  "hex": "#225577",
	  "rgb": {
	    "r": 34,
	    "g": 85,
	    "b": 119
	  },
	  "hsl": {
	    "h": 204.00000000000003,
	    "s": 55.55555555555557,
	    "l": 30
	  },
	  "luminance": 52.69625164088998
	}, 
	{
	  "name": "3am Latte",
	  "hex": "#c0a98e",
	  "rgb": {
	    "r": 192,
	    "g": 169,
	    "b": 142
	  },
	  "hsl": {
	    "h": 32.39999999999999,
	    "s": 28.409090909090907,
	    "l": 65.49019607843137
	  },
	  "luminance": 115.7538984959038
	}, 
	{
	  "name": "8 Bit Eggplant",
	  "hex": "#990066",
	  "rgb": {
	    "r": 153,
	    "g": 0,
	    "b": 102
	  },
	  "hsl": {
	    "h": 320,
	    "s": 100,
	    "l": 30
	  },
	  "luminance": 47.20167786212689
	}, 
	{
	  "name": "A Dime a Dozen",
	  "hex": "#d3dde4",
	  "rgb": {
	    "r": 211,
	    "g": 221,
	    "b": 228
	  },
	  "hsl": {
	    "h": 204.70588235294113,
	    "s": 23.94366197183101,
	    "l": 86.07843137254902
	  },
	  "luminance": 146.57728512290026
	}, 
	{
	  "name": "À L'Orange",
	  "hex": "#f2850d",
	  "rgb": {
	    "r": 242,
	    "g": 133,
	    "b": 13
	  },
	  "hsl": {
	    "h": 31.441048034934504,
	    "s": 89.80392156862744,
	    "l": 50
	  },
	  "luminance": 106.45636443632668
	}, 
	{
	  "name": "A Smell of Bakery",
	  "hex": "#f3e9d9",
	  "rgb": {
	    "r": 243,
	    "g": 233,
	    "b": 217
	  },
	  "hsl": {
	    "h": 36.923076923076934,
	    "s": 51.99999999999997,
	    "l": 90.19607843137254
	  },
	  "luminance": 156.83531086461363
	}, 
	{
	  "name": "A State of Mint",
	  "hex": "#88ffcc",
	  "rgb": {
	    "r": 136,
	    "g": 255,
	    "b": 204
	  },
	  "hsl": {
	    "h": 154.2857142857143,
	    "s": 100,
	    "l": 76.66666666666666
	  },
	  "luminance": 156.8438766959042
	}, 
	{
	  "name": "Abandoned Spaceship",
	  "hex": "#747a8a",
	  "rgb": {
	    "r": 116,
	    "g": 122,
	    "b": 138
	  },
	  "hsl": {
	    "h": 223.6363636363636,
	    "s": 8.661417322834643,
	    "l": 49.80392156862745
	  },
	  "luminance": 81.11128574988808
	}
];

colorNamesList.then(res => {
		namedColors = getClusteredColors(colorClusters, res.colors, false);

		if(form) {
			displayPalette();

			if(!form.querySelector("input[type='text']")) addInput();
		}

		buildSwatchbook(namedColors);
});

let swatchbook = {pageCount: 1, pages: []};
let pageSize = parseInt(sbContainer.dataset['count']) || 10;
let colSize = parseInt(sbContainer.dataset['cols']) || 10;
let rowSize = colSize;

if(parseInt(sbContainer.dataset['rows'])) {
	pageSize = colSize * rowSize;
	rowSize = pageSize / colSize;
}

if(sbIcon) {
	sbIcon.addEventListener("click", function(e) {
		if(!sbContainer.classList.contains("active")) {
			sbContainer.classList.add("active");
		} else {
			sbContainer.classList.remove("active");
		}
	});

	document.addEventListener("click", function(e) {
		if(!document.querySelector(".swatchbook-toggle").contains(e.target) && !document.querySelector(".swatchbook-container").contains(e.target)) {
			sbContainer.classList.remove("active");
		}
	});
}

if(pageNavEl) {
	pageNavEl.querySelectorAll(".nav").forEach(item => {
		item.addEventListener("click", function() {
			if(!item.classList.contains("inactive")) {
				swatchbookPage(item.dataset.target);
			}
		});
	});
}

async function getColorNamesList() {
	try {
		let apiList = await (await fetch("https://api.color.pizza/v1/?noduplicates=true&goodnamesonly=true")).json();

		return apiList;
	} catch {
		return namedColors;
	}
}

function getClusteredColors(clusters=clusteredColors,colors=namedColors,clustered=true) {
	const sortedClusters = clusterColors(clusters, colors);
	const sortedColors = sortedClusters[0].colors && sortedClusters[0].colors.length > 0 ? sortedClusters.reduce((acc, curr) => {
	  return [...acc, ...curr.colors];
	}, []) : sortedClusters;

	if(clustered) return sortedClusters;
	return sortedColors;
}

function buildSwatchbook(swatchPalette=namedColors) {
	// console.log("swatchPalette:", swatchPalette);
	if(swatchPalette.length > 0) {
		swatchbook = {pageCount: 1, pages: []};
		for(let i = 0; i < swatchPalette.length; i += pageSize) {
			swatchbook.pages.push(swatchPalette.slice(i, i + pageSize));
		}
		swatchbook.pageCount = swatchbook.pages.length;

		if(!sbContainer.classList.contains("page")) {
			sbList.style.gridTemplateRows = `repeat(${rowSize}, 1fr)`;
			sbList.style.gridTemplateColumns = `repeat(${colSize}, 1fr)`;
		}

		const clusterCount = sbContainer.querySelectorAll(".cluster").length;
		sbClusterList.style.gridTemplateColumns = `repeat(${clusterCount}, 1fr)`;
		sbContainer.querySelectorAll(".cluster").forEach(cluster => {
			if(!sbContainer.classList.contains("page")) {
				cluster.style.width = clusterCount * 4 - 4 + "px";
				cluster.style.height = clusterCount * 4 - 4 + "px";
			} else {
				cluster.style.width = window.innerWidth / (clusterCount * 2) - 4 + "px";
				cluster.style.height = (window.innerWidth / (clusterCount * 4)) / 4 - 4 + "px";
			}
		});

		swatchbookPage();
		swatchbookNav(1);
	} else {
		sbList.innerHTML = "<li><h2>No swatches in that color group</h></li>";

	}
}

function swatchbookPage(pageNum=1) {
	let sbPageIndex = pageNum - 1;

	if(swatchbook.pages[sbPageIndex] === undefined) pageNum = 0;

	sbList.innerHTML = "";

	swatchbook.pages[sbPageIndex].forEach(color => {
		let li = document.createElement("li");
		li.classList.add("swatch");
		li.setAttribute("data-name", color.name);
		li.setAttribute("data-cluster", color.cluster);
		li.style.backgroundColor = color.hex;

		if(!sbContainer.classList.contains("page")) {
			li.style.width = colSize / 2 + "px";
			li.style.height = colSize / 2 + "px";
		} else {
			li.style.width = window.innerWidth / (colSize / 1.75) + "px";
			li.style.height = window.innerWidth / (colSize / 1.75) + "px";
			li.style.flexBasis = window.innerWidth / (colSize / 1.75) + "px";
		}
		
		sbList.append(li);
	});

	swatchbookNav(pageNum);
}

function swatchbookNav(currentPage=1) {
	const totalPages = swatchbook.pageCount;

	let cpSpan = sbContainer.querySelector(".current-page");
	let tpSpan = sbContainer.querySelector(".total-pages");
	let firstNav = sbContainer.querySelector(".nav-first");
	let prevNav = sbContainer.querySelector(".nav-prev");
	let nextNav = sbContainer.querySelector(".nav-next");
	let lastNav = sbContainer.querySelector(".nav-last");

	cpSpan.innerText = currentPage;
	tpSpan.innerText = totalPages;

	firstNav.dataset.target = 1;
	lastNav.dataset.target = totalPages;

	if(parseInt(currentPage) === 1) {
		firstNav.classList.add("inactive");
		prevNav.classList.add("inactive");
	}

	if(parseInt(currentPage) === parseInt(totalPages)) {
		lastNav.classList.add("inactive");
		nextNav.classList.add("inactive");
	}

	if(parseInt(currentPage) > 1) {
		firstNav.classList.remove("inactive");
		prevNav.classList.remove("inactive");
		prevNav.dataset.target = parseInt(currentPage) - 1;
	}

	if(parseInt(currentPage) < parseInt(totalPages)) {
		lastNav.classList.remove("inactive");
		nextNav.classList.remove("inactive");
		nextNav.dataset.target = parseInt(currentPage) + 1;
	}
}

sbClusterList.querySelectorAll(".cluster").forEach(cluster => {
	cluster.addEventListener("click", function(e) {
		let targetFilter = e.target.dataset.name;

		if(sbClusterList.dataset.filter === "none" || sbClusterList.dataset.filter !== targetFilter) {
			filterOnCluster(targetFilter);
			sbClusterList.dataset.filter = targetFilter;

		} else {
			filterOnCluster("none");
			sbClusterList.dataset.filter = "none";
		}
	});
});

function filterOnCluster(clusterName) {
	console.log("filter on:", clusterName);
	if(clusterName !== "none") {
		let filteredColors = namedColors.filter(color => color.cluster === clusterName);
		buildSwatchbook(filteredColors);

	} else {
		buildSwatchbook(namedColors);
	}
}