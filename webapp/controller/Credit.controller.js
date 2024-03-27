sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "../utilities/utilities",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, u) {
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
                debugger
                const oModel = new JSONModel();
                const oComponent = this.getOwnerComponent();
                const resolveRefText = oComponent.getManifestObject().resolveUri("model/mockData.json");
                await oModel.loadData(resolveRefText);
                const newModel = oModel.getData();
                const oData = newModel.map((item)=> {
                    item.bEditable = false
                })

                oModel.setData(newModel)
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
                debugger
                const oTable = this.byId("ParameterTable")
                const aSelectedItems = oTable.getSelectedIndices();
                const oModel = this.getView().getModel("viewDetail")
                

                if (aSelectedItems.length <= 0) {
                    return this.MessageToast.show("Selecione ao menos um item para editar!"), true
                }

                aSelectedItems.map((item) => {
                    const oData = oTable.getBinding().getModel().getData()[item]// .ID
                    oData.bEditable = true 
                    // DELETE BY ID

                }) 

                // const bEditable = oModel.getProperty("/bEnableEditParam");
                // oModel.setProperty("/bEnableEditParam", !bEditable)

            },

            onSave: function() {
                debugger
                const oTable = this.byId("ParameterTable");

                // PUT
                this.toggleEdit();
            },
            
            onCancel: function() {
                this.toggleEdit();
                
            },

            onDelete: function() {
                const oTable = this.byId("ParameterTable")
                const aSelectedItems = oTable.getSelectedIndices();

                if (aSelectedItems.length <= 0) {
                    return this.MessageToast.show("Selecione ao menos um item para excluir!"), true
                }

                aSelectedItems.map((item) => {
                    const ID = oTable.getBinding().getModel().getData()[item].de // .ID
                    console.log(ID)
                    // DELETE BY ID

                }) 

                // Refresh
            },
            
            sendParameter: function () {
                const inputFrom = this.byId("fromId").getValue();
                const inputTo = this.byId("toId").getValue();
                const oModel = this.getView().getModel("mockData");
            
                const aData = oModel.getProperty("/");
            
                const oNewRow = {
                    de: inputFrom,
                    para: inputTo
                };
                 // POST
                aData.push(oNewRow);
            
                oModel.setProperty("/", aData);
                oModel.refresh(true);

                this.onCloseNewParamDialog();
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

            onOpenAddDialog: function () {
                if (!this.dialog) {
                    this.dialog = sap.ui.xmlfragment(
                        this.getView().getId(),
                        "com.lab2dev.citrosuco.view.fragments.NewParam",
                        this
                    );
                    this.getView().addDependent(this.dialog);
                }

                this.dialog.open();
            },

            onCloseDialog: function () {
                this.sDialog.close();
            },

            onCloseNewParamDialog: function () {
                this.dialog.close();
            },

            onDropPriority: function (event) {
                const getParamContext = (param) =>
                    event.getParameter(param).getBindingContext('mockData')
    
                const mQueuePriority = this.getView().getModel('mockData')
    
                const dropPosition = event.getParameter('dropPosition')
                const dropContext = getParamContext('droppedControl')
                const dragContext = getParamContext('draggedControl')
    
                const { rank } = mQueuePriority.getProperty(dropContext.getPath())
                const rankAdjusted = u.rank.adjust(dropPosition, rank)
                const path = dragContext.getPath()
                const index = Number(path.replace(/\/|.+\//g, ''))
    
                const modelPriorities = mQueuePriority.getData().edit
                const priorities = u.adjust(
                    index,
                    u.bind(u.assoc, 'rank', rankAdjusted),
                    modelPriorities
                )
    
                mQueuePriority.setProperty('/edit', u.rank.recalculate(priorities))
                mQueuePriority.refresh()
            },


        });
    });
