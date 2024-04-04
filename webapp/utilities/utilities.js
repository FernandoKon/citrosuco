sap.ui.define([

], function() {
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

		bindAggregations: function (oEvent, keys) {
			const oObject = {};
		
			if (keys.length <= 0) {
				console.error("A quantidade de chaves não é igual à quantidade de valores.");
				return;
			}
			keys.map((key) => {
				var value = key
				var key = oEvent.getParameter("listItem").getBindingContext().getObject(value);
				oObject[value] = key;
			});
			
			return oObject
		}
		
	}
});