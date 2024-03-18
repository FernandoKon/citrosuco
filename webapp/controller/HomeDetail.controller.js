sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    'sap/f/library',
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary, History) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Home", {
            onInit: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("HomeDetail").attachMatched(this._onRouteMatched, this);
                
            },

            _onRouteMatched: function (oEvent) {
                const sId = oEvent.getParameter("arguments").Id;
            },

            navBack: function(){
                this.onNavBack("RouteHome")
            }
        });
    });
