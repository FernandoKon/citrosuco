sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/lab2dev/citrosuco/utilities/utilities"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, utilities) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Partners", {
            onInit: function () {
            },

            handleSelectionChange: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const params = utilities.bindAggregations(oEvent)
                
                oRouter.navTo("PartnersDetail", params);
            },
        });
    });
