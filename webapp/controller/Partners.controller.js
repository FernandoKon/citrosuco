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
                this._setMockDataModel();
            },

            _setMockDataModel: async function () {
                const oModel = new JSONModel();
                const oComponent = this.getOwnerComponent();
                const resolveRefText = oComponent.getManifestObject().resolveUri("model/mockData.json");
                oModel.loadData(resolveRefText);
                this.getView().setModel(oModel, "mockData");
            },

            test: function () {
                console.log("oi")
            }
        });
    });
