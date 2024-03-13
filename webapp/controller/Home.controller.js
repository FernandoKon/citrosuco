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
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            
            },

            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");
    
                // Save the current route name
                this.currentRouteName = sRouteName;
                this.currentProduct = oArguments.product;
            },
            

            // handleSelectionChange: function (oEvent) {
            //     const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //     const oSelectedItem = oEvent.getSource();
            //     const sID = oSelectedItem.getBindingContext().getProperty("ID");

            //     oRouter.navTo("HomeDetail", {
            //         supplierID: sID
            //     });
            // },

            openDetailView: function (oEvent) {
                debugger
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const oSelectedItem = oEvent.getSource();
                const sID = oSelectedItem.getProperty("type");

                oRouter.navTo("HomeDetail", {supplierId: sID});
                var oFCL = this.byId("flexibleColumnLayout")
    
                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);

            },

            closeDetailView: function () {
                var oFCL = this.byId("ObjectPageLayout").getParent().getParent().getParent();
    
                oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
            }
        });
    });
