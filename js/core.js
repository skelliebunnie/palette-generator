const form = document.querySelector("#color-form");
const contentContainer = document.querySelector("#content");

let colors = getColors();
let palette = {};

let paletteTemplate = document.querySelector("#paletteTemplate");
let inputsTemplate = document.querySelector("#inputsTemplate");

form.addEventListener('submit', function(e) {
	e.preventDefault();

	displayPalette();
});

document.querySelector(".add-color-input").addEventListener('click', function() {
	addInput();
})

function getColors() {
	let inputs = form.querySelectorAll("input"),
			inputColors = [];

	if(inputs) {
		inputs.forEach((input, idx) => {
			if(input.name === "color-name" && input.value !== '') inputColors.push({name: colors[input.value], hex: inputs[idx+1].value});

			if(input.name === "color-name" && input.value === '') inputColors.push({name: colors[input.placeholder], hex: inputs[idx+1].value});
		});
	}

	return inputColors;
}

function displayPalette() {

	contentContainer.innerHTML = "";
	let colorNames = Object.keys(palette);

	colorNames.forEach(colorName => {
		if(colorName !== undefined && colorName !== null && palette[colorName].colors) {
			let colorsList = Object.keys(palette[colorName].colors);

			let colorClassName = colorName.replace(/\s/, "-");

			let templateClone = paletteTemplate.content.cloneNode(true);
			let paletteContainer = templateClone.querySelector(".palette");
			let paletteTitle = paletteContainer.querySelector(".title");
			let paletteColors = paletteContainer.querySelector(".colors");

			paletteContainer.setAttribute("id", `palette-${palette[colorName].id}`)

			paletteTitle.innerHTML = colorName.toUpperCase();
			paletteContainer.append(paletteTitle);

			colorsList.forEach(key => {
				let value = palette[colorName].colors[key];
				let contrast = getContrast(value);

				if(key !== 'DEFAULT') {
					let colorLi = document.createElement("li");
					colorLi.innerHTML = `${colorClassName}-${key} : ${value}`;
					colorLi.style.backgroundColor = value;
					colorLi.classList.add(`text-${contrast}`);

					paletteColors.append(colorLi);

				} else {
					paletteTitle.innerHTML += `<br/>${value}`;
					paletteTitle.style.backgroundColor = value;
					paletteTitle.classList.add(`text-${contrast}`);
				}
			});

			paletteContainer.append(paletteColors);
			contentContainer.append(paletteContainer);
		}
	});
}

function updatePalette() {
	let colorNameInputs = form.querySelectorAll("[name='color-name']");
	let colorValueInputs = form.querySelectorAll("[name='color-value']");

	colorNameInputs.forEach((input, i) => {
		let name = input.value;
		let hex = colorValueInputs[i].value;
		let inputId = input.parentElement.id.substring(input.parentElement.id.indexOf("-") + 1);
		
		let color = colors.filter(c => c.id === inputId)[0];
		if(color) {
			color.hex = hex;
			color.name = name;
		}
	});

	palette = generatePalette(colors);
	displayPalette();
}

function addInput() {
	const inputId = uuid.v4();

	let templateClone = inputsTemplate.content.cloneNode(true);
	let inputsContainer = templateClone.querySelector(".color-inputs");
	inputsContainer.setAttribute("id", `inputs-${inputId}`);

	let colorNameInput = inputsContainer.querySelector("[name='color-name']");
	let colorValueInput = inputsContainer.querySelector("[name='color-value']");

	colorNameInput.addEventListener('blur', updatePalette);
	colorValueInput.addEventListener('input', updatePalette);

	let deleteInputsBtn = inputsContainer.querySelector(".delete-inputs");
	deleteInputsBtn.setAttribute("data-delete", inputId);
	deleteInputsBtn.addEventListener("click", function(e) {
		removeInputAndPalette(inputId);
	});

	let idx = Math.floor(Math.random() * namedColors.length);

	form.append(inputsContainer);

	colorNameInput.value = namedColors[idx].name;
	colorValueInput.value = namedColors[idx].hex;

	colors.push({name: namedColors[idx].name, hex: namedColors[idx].hex, id: inputId});
	palette = generatePalette(colors);
	displayPalette();
}

function removeInputAndPalette(targetId) {
	document.querySelector(`#inputs-${targetId}`).remove();
	document.querySelector(`#palette-${targetId}`).remove();

	colors = colors.filter(color => color.id !== targetId);
}