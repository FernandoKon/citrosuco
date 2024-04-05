sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "com/lab2dev/citrosuco/utilities/utilities"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, utilities) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Home", {
            onInit: function () {
            
            },

            handleSelectionChange: function (oEvent, route) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const params = utilities.bindAggregations(oEvent)
                
                oRouter.navTo(route, params);
            },

            

        });
    });
