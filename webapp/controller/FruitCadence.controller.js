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

        return Controller.extend("com.lab2dev.citrosuco.controller.FruitCadence", {
            onInit: function () {
                
            },

            onBeforeExport: function (oEvent) {

                const dataUrl = oEvent.mParameters.exportSettings.dataSource.dataUrl;
                
                if(dataUrl.includes("orderby")){
                    oEvent.mParameters.exportSettings.dataSource.dataUrl = dataUrl.replace(/\$orderby.*?(?=&|$)/, "$orderby=Contrato%20asc")
                    return 
                } 

                oEvent.mParameters.exportSettings.dataSource.dataUrl = dataUrl.concat("&$orderby=Contrato%20asc")
            },

        });
    });
