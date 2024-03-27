sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Partners", {
            onInit: function () {
            },

            handleSelectionChange: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const sID = oEvent.getParameter("listItem").getBindingContext().getObject().ID;
                const sPartner = oEvent.getParameter("listItem").getBindingContext().getObject().COD_SOCIO;
                const sSupplier = oEvent.getParameter("listItem").getBindingContext().getObject().FORNECEDOR;
                const sPartnerName = oEvent.getParameter("listItem").getBindingContext().getObject().NOME_SOCIO;
            
                oRouter.navTo("PartnersDetail", { name: sPartnerName, Id: sID, Supplier: sSupplier, cod_socio: sPartner});
            },
        });
    });
