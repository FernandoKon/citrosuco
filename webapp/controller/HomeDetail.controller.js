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
            onInit: async function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                await oRouter.getRoute("HomeDetail").attachMatched(this._onRouteMatched, this);
                
            },

            _onRouteMatched: function (oEvent) {
                const sID = oEvent.getParameter("arguments").Id;
                const sProposta = oEvent.getParameter("arguments").proposta;
                const sContrato = oEvent.getParameter("arguments").contrato;
                const sSupplier = oEvent.getParameter("arguments").Supplier;
                this.getView().byId("smartForm").bindElement(`/CaixasContratadas(ID=${sID},PROPOSTA='${sProposta}',CONTRATO='${sContrato}')`)
                
                this.setModel({supplier: sSupplier, id: sID}, "oModel")
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
