let colorNamesList = getColorNamesList();
let namedColors = [];
colorNamesList.then(res => {
		namedColors = res.colors;

		displayPalette();

		if(!form.querySelector("input[type='text']")) addInput();

		buildSwatchbook();
});

let sbIcon = document.querySelector(".swatchbook-toggle");
let sbContainer = document.querySelector(".swatchbook-container");
let sbList = sbContainer.querySelector(".swatchbook-list");
let pageNavEl = sbContainer.querySelector(".page-nav");

let swatchbook = {pageCount: 1, pages: []};
let pageSize = 20;

sbIcon.addEventListener("click", function(e) {
	if(!sbContainer.classList.contains("active")) {
		sbContainer.classList.add("active");
	} else {
		sbContainer.classList.remove("active");
	}
});

document.addEventListener("click", function(e) {
	if(!document.querySelector(".swatchbook").contains(e.target) && !document.querySelector(".swatchbook-container").contains(e.target)) {
		sbContainer.classList.remove("active");
	}
});

pageNavEl.querySelectorAll(".nav").forEach(item => {
	item.addEventListener("click", function() {
		if(!item.classList.contains("inactive")) {
			swatchbookPage(item.dataset.target);
		}
	});
});

async function getColorNamesList() {
	return await (await fetch("https://api.color.pizza/v1/?noduplicates=true&goodnamesonly=true")).json();
}

function buildSwatchbook() {
	let allColors = namedColors.sort((a,b) => {
		/**
		 * sort by:
		 * 1. hue (keep colors together)
		 * 2. saturation
		 * 3. brightness
		 */
		let h = a.hsl.h === b.hsl.h ? 0 : a.hsl.h > b.hsl.h ? -1 : 1;
		let s = a.hsl.s === b.hsl.s ? 0 : a.hsl.s > b.hsl.s ? -1 : 1;
		let l = a.hsl.l === b.hsl.l ? 0 : a.hsl.l > b.hsl.l ? -1 : 1;

		return h;
	});
	
	for(let i = 0; i < allColors.length; i += pageSize) {
		swatchbook.pages.push(allColors.slice(i, i + pageSize));
	}
	swatchbook.pageCount = swatchbook.pages.length;

	sbList.style.gridTemplateRows = `repeat(${pageSize / 5}, 1fr)`;

	swatchbookPage();
	swatchbookNav(1);
}

function swatchbookPage(pageNum=1) {
	if(swatchbook.pages[pageNum - 1] !== undefined) {
		sbList.innerHTML = "";
		swatchbook.pages[pageNum - 1].forEach(color => {
			let li = document.createElement("li");
			li.classList.add("swatch");
			li.setAttribute("data-name", color.name);
			li.style.backgroundColor = color.hex;
			
			sbList.append(li);
		});

		swatchbookNav(pageNum);
	} else {
		console.log("pageNum:", pageNum);
		console.log("swatchbook page:", swatchbook.pages[pageNum - 1]);
	}
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