sap.ui.define([
    "com/lab2dev/citrosuco/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "../model/models",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, exportLibrary, Spreadsheet, models, Sorter) {
        "use strict";

        var EdmType = exportLibrary.EdmType;

        return Controller.extend("com.lab2dev.citrosuco.controller.FruitCadence", {
            onInit: function () {
                
            },

            onBeforeExport: function (oEvent) {
                const dataUrl = oEvent.mParameters.exportSettings.dataSource.dataUrl;
                
                oEvent.mParameters.exportSettings.sizeLimit = sizeLimit
                const entities = this.getEntities()
                const orderByClause = this.verifyEntites(entities)

                if (dataUrl.includes("orderby")) {
                    oEvent.mParameters.exportSettings.dataSource.dataUrl = dataUrl.replace(/\$orderby.*?(?=&|$)/, `$orderby=${orderByClause}`);
                    return;
                }

                oEvent.mParameters.exportSettings.dataSource.dataUrl = dataUrl.concat(`&$orderby=${orderByClause}`);

            },

            getEntities: function () {
                const oTable = this.byId('SmartTableCadence')
                const columns = this.getSelectedColumns(oTable)
                const oModel = oTable.getModel()
                const entity = oModel.oAnnotations._oMetadata.oMetadata.dataServices.schema[0].entityContainer[0].entitySet.find(entity => entity.name === 'CadenciaFrutas')
                const entitiesList = entity.__entityType.property.filter(prop => prop.extensions.find(ext => ext.value === 'measure'))

                const entitiesNames = entitiesList.map((entity) => { return entity.name })

                const entities = this.getEntitiesFromSelectedColumns(columns, entitiesNames)

                return entities;
            },

            getSelectedColumns: function (table) {
                const selectedColumns = table.mAggregations.layoutData.oParent._oTable.mBindingInfos.rows.parameters.select;
                return selectedColumns.split(",");
            },

            getEntitiesFromSelectedColumns: function (columns, entitiesNames) {
                return entitiesNames.filter((item) => {
                    return columns.includes(item);
                });
            },

            verifyEntites: function (entities) {
                var orderByClause;
                if (entities.length !== 0) {
                    orderByClause = entities.map(entity => `${entity}%20asc`).join(',');
                } else {
                    orderByClause = 'Contrato%20asc'
                }

                return orderByClause
            },

            _setModel: async function (filters) {
                try {
                    const { oData } = await models.get({ filters: filters, urlParameters: { $top: 2000000 } });

                    const oModel = oData.results

                    return oModel
                } catch (error) {
                    console.log(error);
                    this.MessageToast.show("Erro inesperado ao consultar a tabela de parâmetros");
                }
            },

            onExport: async function () {
                try {
                    this.getView().setBusy(true)
                    const oTable = this.byId("SmartTableCadence");

                    var oBindingInfo = oTable.getTable().getBindingInfo('rows');
                    const selectedColumns = oBindingInfo.parameters.select;

                    var aFilters = oBindingInfo.filters
                    const measureColumns = this.getEntities();
                    const aSorters = measureColumns.map((e) => {
                        return new Sorter(e)
                    })

                    aSorters.push(new Sorter("Contrato"))

                    var aCols = this.createColumnConfig();

                    const aSelectedColumns = selectedColumns.split(',');

                    const aColsWoorkbook = aCols.filter(item => aSelectedColumns.includes(item.property))

                    const count = oBindingInfo.binding.getCount();
                    const skipBy = 100000;
                    const maxIteration = Math.floor(count / skipBy);
                    let aData = [];

                    for (let i = 0; i <= maxIteration; i++) {
                        const oResponse = await models.get({ filters: aFilters, urlParameters: { $top: skipBy, $skip: i * skipBy, $select: selectedColumns}, sorters: aSorters });
                        aData = aData.concat(oResponse.oData.results)
                    }

                    var oSettings = {
                        workbook: {
                            columns: aColsWoorkbook,
                            hierarchyLevel: "Level",
                        },
                        dataSource: aData,
                        fileName: "Cadência de Fruta.xlsx",
                        worker: false,
                    };

                    var oSheet = new Spreadsheet(oSettings);
                    oSheet.build().finally(function () {
                        oSheet.destroy();
                        this.getView().setBusy(false)
                    }.bind(this));
                } catch (error) {
                    console.log(error)
                    this.getView().setBusy(false)
                }
                this.getView().setBusy(false)
            },

            createColumnConfig: function () {
                var aCols = [];

                // aCols.push({
                //     type: EdmType.Guid,
                //     property: 'ID'
                // });
                aCols.push({
                    type: EdmType.String,
                    property: 'IDFluxo',
                    maxLength: 30
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'SafraPlano'
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'CodRegiaoPlano'
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'DescRegiaoPlano',
                    maxLength: 50
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'TotalCaixasMacro'
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'Contrato',
                    maxLength: 10
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'Fornecedor',
                    maxLength: 10
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'NomeForn',
                    maxLength: 35
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'Imovel',
                    maxLength: 40
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'NomeImovel',
                    maxLength: 40
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'Variedade',
                    maxLength: 40
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'NomeVariedade',
                    maxLength: 40
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'GrpVariedade',
                    maxLength: 8
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'DescGrpVar',
                    maxLength: 40
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'CodRegiao',
                    maxLength: 3
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'NomeRegiao',
                    maxLength: 14
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'SaldoCxsEstimadas'
                });
                aCols.push({
                    type: EdmType.Date,
                    property: 'DataExecucao',
                    displayFormat: 'Date'
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'TipoFluxo'
                });
                aCols.push({
                    type: EdmType.Date,
                    property: 'Data',
                    displayFormat: 'Date'
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'Mes'
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'Semana',
                    maxLength: 6
                });
                aCols.push({
                    type: EdmType.String,
                    property: 'Tipo',
                    maxLength: 10
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'PercentDia',
                    precision: 13,
                    scale: 3
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'CxsDia',
                    precision: 13,
                    scale: 3
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'CxsProgramadas',
                    precision: 13,
                    scale: 3
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'CxsRealizadas',
                    precision: 13,
                    scale: 3
                });
                aCols.push({
                    type: EdmType.Number,
                    property: 'CxsPlanejadas',
                    precision: 13,
                    scale: 3
                });


                return aCols;
            },

        });
    });
