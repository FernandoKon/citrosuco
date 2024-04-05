sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    'sap/f/library',
    "sap/ui/model/json/JSONModel",
    "com/lab2dev/citrosuco/utilities/utilities"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary, JSONModel, utilities) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.EventDetail", {
            onInit: async function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                await oRouter.getRoute("EventDetail").attachMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function (oEvent) {
                debugger
                const params = oEvent.getParameter("arguments")
                
                let bindString = "/EvtContrEntrGet(";

                Object.keys(params).forEach((key, index) => {
                    if (index > 0) {
                        bindString += ",";
                    }
                    bindString += key + "='" + (params[key] || "") + "'";

                    if (key === "Proposta") {
                        this.sSupplier = params[key];
                    }
                });

                bindString += ")";

                this.getView().byId("smartForm").bindElement(bindString);

                this.setModel({supplier: this.sSupplier}, "oModel");
                this._setFilterData(this.sSupplier);

            },

            _setFilterData(low) {
                const oSmartFilterBar = this.byId("smartFilterBar");

                oSmartFilterBar.setFilterData({
                    'Proposta': low
                }, true)

                oSmartFilterBar.search();
            },

            navBack: function () {
                this.onNavBack("RouteHome")
            }
        });
    });
