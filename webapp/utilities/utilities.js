sap.ui.define([

], function () {
	"use strict";

	return {
		assoc: function (prop, value, object) {
			return Object.assign({}, object, { [prop]: value })
		},

		bind: function (fn, ...args) {
			return fn.bind(null, ...args)
		},

		adjust: function (index, fn, list) {
			return [].concat(
				list.slice(0, index),
				[fn(list[index])],
				list.slice(index + 1)
			)
		},

		rank: {
			get(list) {
				return list
					.map((item, i) => ({
						...item,
						// Priority: Math.pow(2, i + 3)
						Priority: i
					}))
					.sort((a, b) => (
						a.Priority < b.Priority ? -1 : 1
					))
			},
			recalculate(list) {
				const sorted = list.sort((a, b) => a.Priority < b.Priority ? -1 : 1)
				return this.get(sorted)
			},
			adjust(position, rank) {
				rank = Number(rank)
				switch (position) {
					case 'Before':
						return rank - 1
					case 'After':
						return rank + 1
					default:
						return rank
				}
			}
		},

		extractParamsObject: function (paramsString) {
			let jsonString = paramsString.match(/aggregation'(.*)'\)/)[1];
			let jsonObj = JSON.parse(jsonString);

			let extractedObj = {};

			for (let key in jsonObj.key) {
				let value = jsonObj.key[key];
				extractedObj[key] = value.replace(/^'|'$/g, '');
			}

			jsonObj.value.forEach((key) => {
				if (!extractedObj.hasOwnProperty(key)) {
					extractedObj[key] = '';
				}
			});

			return extractedObj;
		},

		bindAggregations: function (oEvent) {
			const fullPath = oEvent.getParameter("rowBindingContext").sPath
			const paramsString = this.extractParamsObject(fullPath)

			return paramsString
		}


	}
});