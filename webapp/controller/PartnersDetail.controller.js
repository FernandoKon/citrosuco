sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    'sap/f/library',
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.PartnersDetail", {
            onInit: async function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                await oRouter.getRoute("PartnersDetail").attachMatched(this._onRouteMatched, this);
                
            },

            _onRouteMatched: function (oEvent) {
                const sID = oEvent.getParameter("arguments").Id;
                const sPartner = oEvent.getParameter("arguments").cod_socio;
                const sPartnerName = oEvent.getParameter("arguments").name;
                const sSupplier = oEvent.getParameter("arguments").Supplier;
                this.getView().byId("smartForm").bindElement(`/Socios(ID=${sID},FORNECEDOR='${sSupplier}',COD_SOCIO='${sPartner}')`)
                
                this.setModel({supplier: sSupplier, id: sID, name: sPartnerName}, "oModel")
                this._setFilterData(sSupplier);
            },

            _setFilterData(low) {
                const oSmartFilterBar = this.byId("smartFilterBar");

                oSmartFilterBar.setFilterData({
                    'FORNECEDOR': low
                }, true)

                oSmartFilterBar.search();
            },

            navBack: function(){
                this.onNavBack("RouteHome")
            }
        });
    });
