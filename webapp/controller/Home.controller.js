sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    'sap/f/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Home", {
            onInit: function () {
            
            },

            openDetailView: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const oSelectedItem = oEvent.getSource();
                const sID = oSelectedItem.getProperty("type");

                oRouter.navTo("HomeDetail", {supplierId: sID});

            },

            handleSelectionChange: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const sID = oEvent.getSource().getBindingContext().getProperty("ID");

                oRouter.navTo("HomeDetail", {supplierId: sID});
            },

        });
    });
