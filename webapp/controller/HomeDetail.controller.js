sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    'sap/f/library',
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary, JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.HomeDetail", {
            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("HomeDetail").attachMatched(this._onRouteMatched, this);
                
            },

            _onRouteMatched: function (oEvent) {
                const sID = oEvent.getParameter("arguments").Id;
                this.sSupplier = oEvent.getParameter("arguments").Supplier;
                // this.getView().bindElement(`/CaixasContratadas(${sID})`)
                
                this.setModel({cod: this.sSupplier, id: sID}, "teste")
                this._setFilterData();
            },

            _setFilterData() {
                const oSmartFilterData = this.byId("smartFilterData");
                oSmartFilterData.setLow(this.sSupplier)
            },

            navBack: function(){
                this.onNavBack("RouteHome")
            }
        });
    });
