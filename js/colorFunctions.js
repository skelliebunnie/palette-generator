const defaults = {
  shades: {
    50: '#fafafa',  //'#fafafa',
    100: '#f5f5f5', // '#f4f4f5',
    200: '#eeeeee', // '#e4e4e7',
    300: '#e0e0e0', // '#d4d4d8',
    400: '#bdbdbd', // '#a1a1aa',
    500: '#9e9e9e', // '#71717a',
    600: '#757575', // '#52525b',
    700: '#616161', // '#3f3f46',
    800: '#424242', // '#27272a',
    900: '#212121', // '#18181b'
  },

  colors: {
    primary: 		'#9FB1BC',
    secondary: 	'#AA767C',
    accent: 		'#ECFFB0',
    neutral: 		'#23231A',
  }
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

function rgbToHSL(r,g,b) {
	r /= 255;
  g /= 255;
  b /= 255;
  // (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hslToRGB(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hexToRGB(hex) {
	if(hex === undefined) return [0,0,0];
	hex = hex.toString().replace("#", "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  return [
    parseInt(hex.substr(0, 2), 16),
    parseInt(hex.substr(2, 2), 16),
    parseInt(hex.substr(4, 2), 16)
  ];
}

function rgbToHex(r,g,b) {
	r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return `#${r.toString(16).toUpperCase().padStart(2, "0")}${g
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}${b.toString(16).toUpperCase().padStart(2, "0")}`;
}

function hexToHSL(hex) {
	const rgb = hexToRGB(hex);
  return rgbToHSL(rgb[0], rgb[1], rgb[2]);
}

function matchColor(hex, compHex) {
	const HSL = hexToHSL(hex);
  const compHSL = hexToHSL(compHex);

  const newRGB = hslToRGB(HSL[0], HSL[1], compHSL[2]);

  return rgbToHex(newRGB[0], newRGB[1], newRGB[2]);
}

function getContrast(hex) {
	let rgb = hexToRGB(hex);

	const brightness = Math.round(
			((parseInt(rgb[0]) * 299) +
			 (parseInt(rgb[1]) * 587) +
			 (parseInt(rgb[2]) * 114)) /
			 1000
		);

	return brightness > 125 ? 'dark' : 'light';
	// if(contrastRatio(hex, "#FFFFFF") > 4.5) {
	// 	return 'light';
	// } else {
	// 	return 'dark';
	// }
}

function luminance(hex) {
	const rgb = hexToRGB(hex);
	let srgbR = rgb[0] / 255,
			srgbG = rgb[1] / 255,
			srgbB = rgb[2] / 255;

	let R = srgbR <= 0.04045 ? srgbR / 12.92 : Math.pow((srgbR + 0.055) / 1.055, 2.4);
	let G = srgbG <= 0.04045 ? srgbG / 12.92 : Math.pow((srgbG + 0.055) / 1.055, 2.4);
	let B = srgbB <= 0.04045 ? srgbB / 12.92 : Math.pow((srgbB + 0.055) / 1.055, 2.4);
	console.log(rgb,R,G,B);

	const L = 0.2126 * R + G + 0.0722 * B;
}

function contrastRatio(c1, c2) {
	const L1 = luminance(c1);
	const L2 = luminance(c2);

	return (L1 + 0.05) / (L2 + 0.05);
}

function generatePalette(inputColors=[], inputShades=[]) {
	let colors = {}, shades = {}, hasIds = false;
	if(!inputColors || (Array.isArray(inputColors) && inputColors.length === 0) || (typeof inputColors === "object" && Object.keys(inputColors).length === 0)) colors = defaults.colors;
	if(!inputShades || (Array.isArray(inputShades) && inputShades.length === 0) || (typeof inputShades === "object" && Object.keys(inputShades).length === 0)) shades = defaults.shades;

	if(Array.isArray(inputColors) && inputColors.length > 0) {
		inputColors.forEach(color => colors[color.name] = color.hex);
		
		if(inputColors[0].id) hasIds = true;
	}	

	const colorKeys = Object.keys(colors);
	const shadeKeys = Object.keys(shades);

	let palette = {};
	for(var i = 0; i < colorKeys.length; i++) {
		const name = colorKeys[i];
		const color = colors[name];
		if(hasIds) {
			palette[name] = {
				id: inputColors[i].id,
				colors: []
			};
		} else {
			palette[name] = [];
		}

		for(var x = 0; x < shadeKeys.length; x++) {
			const value = shadeKeys[x];
			const shade = shades[value];

			if(hasIds) {
				palette[name].colors[value] = matchColor(color, shade);
				palette[name].colors.DEFAULT = color;
			} else {
				palette[name][value] = matchColor(color, shade);
				palette[name].DEFAULT = color;
			}
		}
	}

	return palette;
}

// module.exports = {
// 	defaults,
// 	hue2rgb,
// 	rgbToHSL,
// 	hslToRGB,
// 	hexToRGB,
// 	rgbToHex,
// 	hexToHSL,
// 	matchColor,
// 	generatePalette
// }