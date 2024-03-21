sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController"
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
                const sID = oEvent.getParameter("listItem").getBindingContext().getObject().ID;
                const sProposta = oEvent.getParameter("listItem").getBindingContext().getObject().PROPOSTA;
                const sContrato = oEvent.getParameter("listItem").getBindingContext().getObject().CONTRATO;
                const sSupplier = oEvent.getParameter("listItem").getBindingContext().getObject().FORNECEDOR;
            
                oRouter.navTo("HomeDetail", { Id: sID, Supplier: sSupplier, proposta: sProposta, contrato: sContrato });
            },
            

        });
    });
