sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function(BaseController, JSONModel, MessageBox, MessageToast) {
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
    })
});