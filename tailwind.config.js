/** @type {import('tailwindcss').Config} */
"use strict";

const defaultTheme = require( "tailwindcss/defaultTheme" );

module.exports = {
	content: [ "src/views/*.html", "public/**/*.js" ],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"montserrat",
					...defaultTheme.fontFamily.sans
				]
			},
			keyframes: {
				wiggle: {
					"0%, 100%": { transform: "rotate(-3deg)" },
					"50%": { transform: "rotate(3deg)" }
				}
			},
			animation: {
				wiggle: "wiggle 2s ease-in-out infinite"
			}
		},
	},
	plugins: [],
};
