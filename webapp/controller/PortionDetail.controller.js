sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.PortionDetail", {
            onInit: async function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                await oRouter.getRoute("PortionDetail").attachMatched(this._onRouteMatched, this);
                

            },

            _onRouteMatched: function (oEvent) {
                debugger
                const params = oEvent.getParameter("arguments")
                
                let bindString = "/EvtParcGet(";

                Object.keys(params).forEach((key, index) => {
                    if (index > 0) {
                        bindString += ",";
                    }
                    bindString += key + "=" + (key === "DtParcela" ? params[key] : "'" + (params[key] || "") + "'");

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
            }
        });
    });
