sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Credit", {
            onInit: function () {

                this._setMockDataModel();

                const viewDetail = new JSONModel({
                    bEnableEditParam: false
                })

                this.getView().setModel(viewDetail, "viewDetail")

            },

            _setMockDataModel: async function () {
                const oModel = new JSONModel();
                const oComponent = this.getOwnerComponent();
                const resolveRefText = oComponent.getManifestObject().resolveUri("model/mockData.json");
                oModel.loadData(resolveRefText);
                this.getView().setModel(oModel, "mockData");
            },

            handleRebindTable: async function () {
                const oTable = this.getView().byId("oTable");
            
                await new Promise(resolve => {
                    oTable.attachEventOnce("updateFinished", resolve);
                });
            
                const oSmartTable = this.getView().byId("SmartTable");
                const oColumns = oSmartTable.getTable().getColumns();
            
                let columnIndex = -1;
                oColumns.forEach(function (oColumn, index) {
                    const columnBinding = oColumn.getAggregation("tooltip");
                    if (columnBinding === "SAFRA") {
                        columnIndex = index;
                        return false;
                    }
                });
                var aItems = oTable.getItems();
                
                const Param = this.sParam;
            
                aItems.forEach(function (oItem) {
                    const safraText = oItem.getCells()[columnIndex].getText();
            
                    if (Param.includes("*")) {
                        const regexString = Param.replace(/\*/g, ".*"); 
                        const regex = new RegExp(regexString, "i"); 
            
                        if (regex.test(safraText)) {
                            oItem.getCells()[0].setText("PARAMETRO");
                        } else if (safraText === "2022") {
                            oItem.getCells()[0].setText("2022");
                        } else {
                            oItem.getCells()[0].setText("Não Identificado");
                        }
                    } else {
                        if (safraText.includes(Param)) { 
                            oItem.getCells()[0].setText("PARAMETRO");
                        } else if (safraText === "2022") {
                            oItem.getCells()[0].setText("2022");
                        } else {
                            oItem.getCells()[0].setText("Não Identificado");
                        }
                    }
                });
            },

            toggleEdit: function () {
                const oModel = this.getView().getModel("viewDetail")
                const bEditable = oModel.getProperty("/bEnableEditParam");

                oModel.setProperty("/bEnableEditParam", !bEditable)

            },

            onSave: function() {
                this.toggleEdit();
            },
            
            onCancel: function() {
                this.toggleEdit();

            },

            sendParameter: function () {
                this.sParam = this.byId("idParameter").getValue()
                this.onCloseDialog()
            },

            onOpenDialog: function () {
                if (!this.sDialog) {
                    this.sDialog = sap.ui.xmlfragment(
                        this.getView().getId(),
                        "com.lab2dev.citrosuco.view.fragments.Parameters",
                        this
                    );
                    this.getView().addDependent(this.sDialog);
                }

                this.sDialog.open();
            },

            onCloseDialog: function () {
                this.sDialog.close();
            }


        });
    });
