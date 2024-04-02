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
		
		rank: {
			get(list) {
				return list
					.map((item, i) => ({
						...item,
						rank: Math.pow(2, i + 3)
					}))
					.sort((a, b) => (
						a.rank < b.rank ? -1 : 1
					))
			},
			recalculate(list) {
				const sorted = list.sort((a, b) => a.rank < b.rank ? -1 : 1)
				return this.get(sorted)
			},
			adjust(position, rank) {
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
		
			// Verifica se a quantidade de chaves é igual à quantidade de valores
			if (keys.length <= 0) {
				console.error("A quantidade de chaves não é igual à quantidade de valores.");
				return;
			}
		
			// Usa map para criar o objeto
			keys.map((key) => {
				var value = key
				var key = oEvent.getParameter("listItem").getBindingContext().getObject(value);
				oObject[value] = key;
			});
			
			return oObject
		}
		
	}
});