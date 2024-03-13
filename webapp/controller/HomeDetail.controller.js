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
                // this.oComponent = this.getOwnerComponent();
                // this.oAppView = oComponent.byId("App");
                
            },

            handleSelectionChange: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const oSelectedItem = oEvent.getSource();
                const sID = oSelectedItem.getBindingContext().getProperty("ID");

                oRouter.navTo("SupplierDetail", {
                    supplierID: sID
                });
            },

            onListItemPress: function () {
                var oFCL = this.byId("flexibleColumnLayout")
    
                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
            }
        });
    });
