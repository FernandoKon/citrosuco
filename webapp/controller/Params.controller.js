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
    function (Controller, JSONModel, utilities, deepClone, models) {
        "use strict";

        return Controller.extend("com.lab2dev.citrosuco.controller.Params", {
            onInit: function () {

                this._setCreditParamsModel();
                this._setDebitParamsModel();

                const viewDetail = new JSONModel({
                    bEnableEditParam: false
                })

                this.getView().setModel(viewDetail, "viewDetailC")

                const viewDetailD = new JSONModel({
                    bEnableEditParam: false
                })

                this.getView().setModel(viewDetailD, "viewDetailD")

            },

            _setCreditParamsModel: async function () {
                try {
                    const { oData } = await models.getParams();

                    const filteredData = oData.results.filter(item => item.Type === "credit");

                    filteredData.forEach(item => {
                        item.bEditable = false;
                    });

                    this.setModel(filteredData, "credit");
                } catch (error) {
                    console.log(error);
                    this.MessageToast.show("Erro inesperado ao consultar a tabela de parâmetros");
                }
            },

            _setDebitParamsModel: async function () {
                try {
                    const { oData } = await models.getParams();

                    const filteredData = oData.results.filter(item => item.Type === "debit");

                    filteredData.forEach(item => {
                        item.bEditable = false;
                    });

                    this.setModel(filteredData, "debit");
                } catch (error) {
                    console.log(error);
                    this.MessageToast.show("Erro inesperado ao consultar a tabela de parâmetros");
                }
            },

            toggleEdit: function (type) {
                const modelId = type === "credit" ? "viewDetailC" : "viewDetailD";
                const oModel = this.getView().getModel(modelId);
                const bEditable = oModel.getProperty("/bEnableEditParam");
                oModel.setProperty("/bEnableEditParam", !bEditable);
            },

            visibleChange: function (type) {
                const oModel = this.getView().getModel(type);
                const oData = oModel.getData();
                const oDataClone = deepClone(oData);
                const oEditFormModel = new JSONModel(oDataClone);
                this.getView().setModel(oEditFormModel, 'editForm');
            
                const oTable = this.byId(type);
                const aSelectedItems = oTable.getSelectedIndices();
            
                if (aSelectedItems.length <= 0) {
                    return this.MessageToast.show("Selecione ao menos um item!"), true;
                }
            
                aSelectedItems.map((indice) => {
                    const oData = oModel.getData();
                    const oSelectedItem = oData.at(indice);
                    oSelectedItem.bEditable = !oSelectedItem.bEditable;
                });
            
                oModel.refresh(true);
                this.toggleEdit(type);
            }, 

            onEdit: function (type) {
                const dialogData = this.getModel("editForm");
                this.visibleChange(type);
            },

            onSave: async function (type) {
                const oTable = this.byId(type);
                const priorities = oTable.getSelectedIndices();
            
                priorities.map(async (item) => {
                    var Items = this.getView().getModel(type).getData().at(item)
                    var ID = `Priority='${Items.Priority}',Type='${type}'`
                    var editedRow = {
                        Priority: Items.Priority.toString(),
                        Type: type,
                        Fillter: Items.Fillter,
                        Text: Items.Text
                    };
            
                    await models.putParams(ID, editedRow)
                })
            
                this.visibleChange(type);
                oTable.clearSelection();
            },      

            onCancel: function (type) {
                const oEditFormModel = this.getView().getModel("editForm");
                const oModel = this.getView().getModel(type);
                const oTable = this.byId(type);
                let oData;
            
                if (type === "credit" || type === "debit") {
                    oData = oModel.getData();
                    oData.forEach((item) => {
                        if (item.bEditable) {
                            item.bEditable = false;
                        }
                    });
                }
            
                if (type === "credit") {
                    oData = oEditFormModel.getData();
                }
            
                oModel.setData(oData);
                oTable.clearSelection();
                this.toggleEdit(type);
                oModel.refresh(true);
            },
        
            verifySelectedIndices: function (table) {
                const indices = table.getSelectedIndices();

                if (indices.length <= 0) {
                    return this.MessageToast.show("Selecione ao menos 1 item!")
                } else {
                    return indices;
                }
            },

            onDelete: async function (type) {
                const oTable = this.byId(type);
                const priorities = this.verifySelectedIndices(oTable);
            
                const promises = priorities.map(async (item) => {
                    var Items = this.getView().getModel(type).getData().at(item)
                    var ID = `Priority='${Items.Priority}',Type='${type}'`
            
                    return models.deleteParams(ID)
                });
            
                await Promise.allSettled(promises);
            
                if (type === "credit") {
                    await this._setCreditParamsModel();
                } else if (type === "debit") {
                    await this._setDebitParamsModel();
                }
            
                this.MessageToast.show("Regra(s) deletada(s) com sucesso!")
            
                oTable.clearSelection();
            },
        
            sendParameter: async function (type) {
                const dialog = type === "credit" ? this.dialog : this.dialogDebit;
                const inputFromId = type === "credit" ? "fromId" : "fromIdD";
                const inputToId = type === "credit" ? "toId" : "toIdD";

                dialog.setBusy(true);
                const newPriority = this.byId(type).getBinding().getLength();
                const sPriority = newPriority.toString();
                const inputFrom = this.byId(inputFromId).getValue();
                const inputTo = this.byId(inputToId).getValue();

                if (!inputFrom || !inputTo) {
                    dialog.setBusy(false);
                    return this.MessageToast.show("Preencha os campos necessários!");
                }

                try {
                    const oNewRow = {
                        Priority: sPriority,
                        Type: type,
                        Fillter: inputFrom,
                        Text: inputTo
                    };
                    await models.postParams(oNewRow);

                    if (type === "credit") {
                        await this._setCreditParamsModel();
                    } else {
                        await this._setDebitParamsModel();
                    }

                    dialog.setBusy(false);

                    this.onCloseNewParamDialog(type);
                    this.MessageToast.show("Regra criada com sucesso!");
                } catch (error) {
                    console.error(error);
                    dialog.setBusy(false);
                    this.MessageToast.show("Ocorreu um erro ao criar a regra!");
                }
            },

            onOpenAddDialog: async function (type) {
                const dialog = type === "credit" ? this.dialog : this.dialogDebit;
                const dialogId = type === "credit" ? "com.lab2dev.citrosuco.view.fragments.NewParam" : "com.lab2dev.citrosuco.view.fragments.NewParamD";
                const dialogProperty = type === "credit" ? "dialog" : "dialogDebit";
            
                if (!dialog) {
                    try {
                        const fragment = await sap.ui.core.Fragment.load({
                            id: this.getView().getId(),
                            name: dialogId,
                            controller: this
                        });
                        this[dialogProperty] = fragment;
                        this.getView().addDependent(this[dialogProperty]);
                    } catch (error) {
                        console.error("Error loading fragment:", error);
                        return;
                    }
                }
            
                dialog.open();
            },     

            onCloseNewParamDialog: function (type) {
                if (this.dialog && this.dialog.isOpen()) {
                    this._clearInputs(type);
                    this.dialog.close();
                }
                if (this.dialogDebit && this.dialogDebit.isOpen()) {
                    this._clearInputs(type);
                    this.dialogDebit.close();
                }
            },

            _clearInputs: function (type) {
                const inputFromId = type === "credit" ? "fromId" : "fromIdD";
                const inputToId = type === "credit" ? "toId" : "toIdD";

                this.byId(inputFromId).setValue("");
                this.byId(inputToId).setValue("");

            },

            onDropPriority: function (event, type) {
                const getParamContext = (param) =>
                    event.getParameter(param).getBindingContext(type)

                const mQueuePriority = this.getView().getModel(type)

                const dropPosition = event.getParameter('dropPosition')
                const dropContext = getParamContext('droppedControl')
                const dragContext = getParamContext('draggedControl')

                const { Priority } = mQueuePriority.getProperty(dropContext.getPath())
                const rankAdjusted = utilities.rank.adjust(dropPosition, Priority)
                const path = dragContext.getPath()
                const index = Number(path.replace(/\/|.+\//g, ''))

                const modelPriorities = mQueuePriority.getData();
                const priorities = utilities.adjust(
                    index,
                    utilities.bind(utilities.assoc, 'Priority', rankAdjusted),
                    modelPriorities
                )

                utilities.rank.recalculate(priorities).map(item => item.Priority);

                priorities.map(async (item, index) => {
                    var ID = `Priority='${index}',Type='${type}'`
                    var editedRow = {
                        Fillter: item.Fillter,
                        Text: item.Text
                    };

                    await models.putParams(ID, editedRow)

                })
                if (type == "credit") {
                    this._setCreditParamsModel();
                } else if (type == "debit") {
                    this._setDebitParamsModel();
                }
            },


        });
    });
