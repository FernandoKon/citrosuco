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
	}
});