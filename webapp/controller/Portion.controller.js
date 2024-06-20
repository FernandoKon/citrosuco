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

        return Controller.extend("com.lab2dev.citrosuco.controller.Portion", {
            onInit: function () {
                this.attachSmartTableClickEvent({
                    tableId: "SmartTablePortion",
                    route: "PortionDetail",
                    keyColumns: ["Proposta","Safra","Contrato","DtParcela"]
                });
            },

        });
    });
