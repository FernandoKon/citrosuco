sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "com/lab2dev/citrosuco/connection/connector"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, connector) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            get: async function(options){
                return connector.read("dataSource", "/CadenciaFrutas", options)
            },

            getParams: async function(){
                return connector.read("dataSource", "/ComparisonGet")
            },

            postParams: async function(oData){
                return connector.create("dataSource", "/ComparisonGet", oData)
            },

            putParams: async function(ID, oData){
                return connector.update("dataSource", `/ComparisonGet(${ID})`, oData)
            },

            deleteParams: async function(ID){
                return connector.remove("dataSource", `/ComparisonGet(${ID})`)
            },
        };
    });