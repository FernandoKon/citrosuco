sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Home", {
            onInit: function () {

            },

            handleSelectionChange: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const oSelectedItem = oEvent.getSource();
                const sID = oSelectedItem.getBindingContext().getProperty("ID");

                oRouter.navTo("SupplierDetail", {
                    supplierID: sID
                });
            }
        });
    });
