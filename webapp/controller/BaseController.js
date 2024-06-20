sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "com/lab2dev/citrosuco/utilities/utilities"

], function (BaseController, JSONModel, MessageBox, MessageToast, History, utilities) {
    'use strict';
    return BaseController.extend("com.lab2dev.btpexperiencemainscreen.controller.BaseController", {

        MessageBox: MessageBox,
        MessageToast: MessageToast,

        getModel: function (sNameModel) {
            return this.getView().getModel(sNameModel)
        },

        setModel: function (oModel, sNameModel) {
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

        attachSmartTableClickEvent: function (eventDefinition) {
            const [table] = this.byId(eventDefinition.tableId).getAggregation("items");
            table.attachCellClick((oEvent) => {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const params = utilities.bindAggregations(oEvent);

                if (!this.verifyColumns(eventDefinition, params)) {
                    return;
                }
    
                this.extractDtParcela(params);
        
                oRouter.navTo(eventDefinition.route, params);
            });
        },

        extractDtParcela: function (params) {
            if (params.ID__) {
                try {
                    // Match the DtParcela part in the params.ID
                    const dtParcelaMatch = params.ID__.match(/"DtParcela":"datetime'%2FDate\((\d+)\)%2FT00:00:00'/);
                    if (dtParcelaMatch) {
                        const timestamp = parseInt(dtParcelaMatch[1], 10);
                        const dtParcela = new Date(timestamp);
                        const formattedDtParcela = dtParcela.toISOString().split('T')[0];
                        params.DtParcela = formattedDtParcela;
                    }
                } catch (e) {
                    console.error("Erro ao processar o ID:", e);
                }
            }
        },
        

        verifyColumns: function (eventDefinition, params) {
            const requiredColumns = eventDefinition.keyColumns;
        
            const missingColumns = requiredColumns.filter(column => !params.hasOwnProperty(column));
    
            if (missingColumns.length > 0) {
                sap.m.MessageToast.show(`As seguintes colunas chave estão faltando: ${missingColumns.join(', ')}`);
                return false;
            }
            return true;
        },

        onSmartTableInit: function (oEvent, type) {
            const table = oEvent.getSource()
            this.getAggregationOfType(table, `sap.ui.table.${type}`).setSelectionMode(sap.ui.table.SelectionMode.Single);
        },

        getAggregationOfType: function (control, type) {
            const aggregationType = control.getAggregation("items");

            return aggregationType.find((aggregation) => aggregation.getMetadata().getName() == type);
        }
        
    })
});