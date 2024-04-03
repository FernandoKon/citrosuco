sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "../utilities/utilities",
    "sap/base/util/deepClone",
    "../model/models",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, u, deepClone, models) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Credit", {
            onInit: function () {

                this._setParamsModel();

                const viewDetail = new JSONModel({
                    bEnableEditParam: false
                })

                this.getView().setModel(viewDetail, "viewDetail")

            },

            _setParamsModel: async function () {
                try {
                    const { oData } = await models.getParams()

                    const oModel = oData.results

                    const newData = oModel.map((item)=> {
                        item.bEditable = false
                    })

                    this.setModel(oModel, "params")
                } catch (error) {
                    console.log(error);
                    this.MessageToast.show("Erro inesperado ao consultar a tabela de parâmetros");
                };
            },

            toggleEdit: function (){
                const oModel = this.getView().getModel("viewDetail")
                const bEditable = oModel.getProperty("/bEnableEditParam");
                oModel.setProperty("/bEnableEditParam", !bEditable)
            },

            visibleChange: function () {
                const oModel = this.getView().getModel("params")
                const oData = oModel.getData();
                const oDataClone = deepClone(oData)
                const oEditFormModel = new JSONModel(oDataClone)

                this.getView().setModel(oEditFormModel, 'editForm')

                const oTable = this.byId("ParameterTable")
                const aSelectedItems = oTable.getSelectedIndices();
                
                if (aSelectedItems.length <= 0) {
                    return this.MessageToast.show("Selecione ao menos um item!"), true
                }
                
                aSelectedItems.map((indice) => {
                    const oData = oModel.getData();
                    const oSelectedItem = oData.at(indice)
                    oSelectedItem.bEditable = !oSelectedItem.bEditable
                }) 
                oModel.refresh(true);
                this.toggleEdit();
            },

            onEdit: function () {
                const dialogData = this.getModel("editForm");
                this.visibleChange(); 

            },

            onSave: async function() {
                const oTable = this.byId("ParameterTable");
                const priorities = oTable.getSelectedIndices();
                
                priorities.map(async (item) => {
                    var Items = this.getView().getModel("params").getData().at(item)
                    var ID = `Priority='${Items.Priority}',Type='credit'`
                    var editedRow = {
                        Priority: Items.Priority.toString(),
                        Type: "credit",
                        Fillter: Items.Fillter,
                        Text: Items.Text
                    };

                    await models.putParams(ID,editedRow)
                    
                })
                
                this.visibleChange();
                oTable.clearSelection();
            },
            
            onCancel: function() {
                const oEditFormModel = this.getView().getModel("editForm")
                const oModel = this.getView().getModel("params")

                const oTable = this.byId("ParameterTable")
                var oData = oModel.getData();
                oData.map((item) => {
                    if (item.bEditable == true) {
                        item.bEditable = false
                    }
                })
                oData = oEditFormModel.getData();
                oModel.setData(oData);

                oTable.clearSelection();

                this.toggleEdit();
                oModel.refresh(true);
                
            },

            onDelete: function() {
                const oTable = this.byId("ParameterTable");
                const priorities = oTable.getSelectedIndices();
                
                priorities.map(async (item) => {
                    var Items = this.getView().getModel("params").getData().at(item)
                    var ID = `Priority='${Items.Priority}',Type='credit'`
                    var editedRow = {
                        Priority: Items.Priority.toString(),
                        Type: "credit",
                        Fillter: Items.Fillter,
                        Text: Items.Text
                    };

                    await models.deleteParams(ID,editedRow)
                    
                })
                
                oTable.clearSelection();

            },
            
            sendParameter: async function () {
                const newPriority = this.byId("ParameterTable").getBinding().getLength();
                const sPriority = newPriority.toString();
                const inputFrom = this.byId("fromId").getValue();
                const inputTo = this.byId("toId").getValue();
                const oModel = this.getView().getModel("params");
                
                if (!inputFrom || !inputTo) {
                    return this.MessageToast.show("Preencha os campos necessários!")
                }

            
                const oNewRow = {
                    Priority: sPriority,
                    Type: "credit",
                    Fillter: inputFrom,
                    Text: inputTo
                };
                 // POST
                await models.postParams(oNewRow)
                oModel.refresh(true);

                this.onCloseNewParamDialog();
                this.MessageToast.show("Regra criada com sucesso!")
            },

            onOpenDialog: async function () {
                if (!this.sDialog) {
                    this.sDialog = sap.ui.xmlfragment(
                        this.getView().getId(),
                        "com.lab2dev.citrosuco.view.fragments.Parameters",
                        this
                    );
                    this.getView().addDependent(this.sDialog);
                }

                const oModel = await this.getView().getModel("params")
                const oData = oModel.getData();
                const oDataClone = deepClone(oData)
                const oEditFormModel = new JSONModel(oDataClone)
                this.getView().setModel(oEditFormModel, 'editForm')

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
