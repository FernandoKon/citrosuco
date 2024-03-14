sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"

], function(BaseController, JSONModel, MessageBox, MessageToast, History) {
    'use strict';
    return BaseController.extend("com.lab2dev.btpexperiencemainscreen.controller.BaseController", {
        
        MessageBox: MessageBox,
        MessageToast: MessageToast,

        getModel: function(sNameModel){
            return this.getView().getModel(sNameModel)
        },

        setModel: function(oModel, sNameModel){
            return this.getView().setModel(new JSONModel(oModel), sNameModel)
        },

        onNavBack: function (sRoute) {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oComponent = this.getOwnerComponent()
                const oRouter = oComponent.getRouter();
                oRouter.navTo(sRoute, {}, true);
            }
        },
    })
});