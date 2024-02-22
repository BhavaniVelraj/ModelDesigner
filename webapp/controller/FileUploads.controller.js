sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/IconTabBar",
    "sap/m/IconTabFilter",
    "sap/m/IconTabSeparator",
    "sap/ui/layout/PaneContainer",
    "sap/ui/layout/SplitterLayoutData",
    "sap/m/Panel",
    "sap/m/Text",
    "sap/m/Page",
    "sap/m/Label",
    "sap/ui/unified/FileUploader",
    "sap/m/Button",
    "sap/f/DynamicPage",
    "sap/f/DynamicPageTitle",
    "sap/f/DynamicPageHeader",
    "sap/m/Table",
    "sap/m/Column",
    "sap/ui/core/Icon",
], (Controller, JSONModel, IconTabBar, IconTabFilter, IconTabSeparator, PaneContainer, SplitterLayoutData,
    Panel, Text, Page, Label, FileUploader, Button, DynamicPage, DynamicPageTitle, DynamicPageHeader,
    Table, Column, Icon) => {
    "use strict"
    return Controller.extend("ui5.walkthrough.controller.FileUploads", {
        onInit: function () {
            var oModel = new JSONModel("model/Calc.json");
            this.getView().setModel(oModel, "comboboxitem");
            console.log("12345", oModel)

            var oODataModel = new JSONModel({
                Links: [] // Add your OData links here dynamically
            });
            this.getView().setModel(oODataModel, "odata");
            // Create a variable to store the JSON model
            this.oJsonModel = null;


            this.createInnerSplitPanes();
            this.createTableSplitePanes();
            var responsivesplitter = new sap.ui.layout.ResponsiveSplitter("responsivesplitter", {
                rootPaneContainer: this.oInnerPaneContainer
            });
            var TableResponsiveSplitter = new sap.ui.layout.ResponsiveSplitter("tableresponsivesplitter", {
                rootPaneContainer: this.oInnerTablePaneContainer
            });
            var oicontabbar = new IconTabBar(this.createId("idIconTabBar"), {
                stretchContentHeight: true,
                items: [
                    new IconTabFilter({
                        count: "{modeldesign>/tabicon/Total}",
                        text: "Model Designer",
                        key: "All"
                    }),
                    new IconTabSeparator(),
                    new IconTabFilter({
                        iconColor: "Positive",
                        count: "{modeldesign>/tabicon/Weight/Ok}",
                        text: "Upload",
                        key: "Ok",
                        content: [
                            responsivesplitter
                        ]
                    }),
                    new IconTabFilter({
                        iconColor: "Negative",
                        count: "{modeldesign>/tabicon/Weight/Medium}",
                        text: "Model Creation",
                        key: "Medium",
                        content: [
                            new Text({ text: "This is Model Creation Page..... " })
                        ]
                    }),
                    new IconTabFilter({
                        iconColor: "Positive",
                        count: "{modeldesign>/tabicon/Weight/Medium}",
                        text: "Table Creation",
                        key: "Medium",
                        content: [
                            TableResponsiveSplitter
                        ]
                    }),
                ]
            });

            var opage = new Page({
                headerContent: [
                    new sap.m.ToolbarSpacer(),
                    new sap.m.Title({
                        text: "Model Designer"
                    }),
                    new sap.m.ToolbarSpacer(),
                ],
                content: [oicontabbar]
            });

            this.getView().byId("icontabpage").addContent(opage);
        },
        createInnerSplitPanes: function () {
            this.oInnerPaneContainer = new PaneContainer({
            });
            this.oInnerVerticalContainer = new PaneContainer({
                orientation: "Vertical"
            });
            this.oInnerVerticalSplitPane1 = new sap.ui.layout.SplitPane({
                layoutData: new SplitterLayoutData({
                    size: "50%"
                }),
                content: new Page({
                    title: "Upload File",
                    headerText: "Upload Metadata",
                    content: [
                        new Label({
                            text: "Choose a file:",
                        }),
                        new FileUploader(this.createId("fileChoosen"), {
                            id: "fileUploader",
                            change: this.onFileUploadChange.bind(this)
                        }),
                        new sap.m.Input(this.createId("inputurl"), {
                            placeholder: "Enter your Service Url"
                        }),
                        new sap.m.Button(this.createId("serviceurl"), {
                            text: "Ok",
                            press: this.onButtonClick.bind(this)
                        })

                    ]
                })
            });
            this.oInnerVerticalSplitPane2 = new sap.ui.layout.SplitPane(this.createId("splitpane2"), {
                layoutData: new SplitterLayoutData({
                    size: "30%"
                }),
                content: [new sap.m.Page(this.createId("split2"), {
                    title: "uploaded Metadata Files"
                })]
            });
            this.oInnerVerticalSplitPane3 = new sap.ui.layout.SplitPane(this.createId("splitpane3"), {
                layoutData: new SplitterLayoutData({
                    size: "30%"
                }),
                content: [new sap.m.Page(this.createId("split3"), {
                    title: "Service URL"
                })]
            });
            this.oInnerHoriZontalContainer = new PaneContainer({
                orientation: "Horizontal"
            });
            this.oInnerHorizontalSplitPane1 = new sap.ui.layout.SplitPane({
                layoutData: new SplitterLayoutData({
                    // size: ""
                }),
                content: this.oDynamicPage()
            });
            this.oInnerPaneContainer.addPane(this.oInnerVerticalContainer);
            this.oInnerVerticalContainer.addPane(this.oInnerVerticalSplitPane1);
            this.oInnerVerticalContainer.addPane(this.oInnerVerticalSplitPane2);
            this.oInnerVerticalContainer.addPane(this.oInnerVerticalSplitPane3);
            this.oInnerPaneContainer.addPane(this.oInnerHoriZontalContainer);
            this.oInnerHoriZontalContainer.addPane(this.oInnerHorizontalSplitPane1);
        },

        otable: function () {
            var cli = new sap.m.ColumnListItem();
            var updschema = new Text({
                text: "{jsonModel>schemaIndex}",
            });
            cli.addCell(updschema);
            var stLi = new sap.m.StandardListItem({
                icon: "sap-icon://detail-view",
                title: "{jsonModel>}",
                itemPress: this.iconclick.bind(this)

            });
            var updentitype = new sap.m.List({
                items: {
                    path: "jsonModel>entityTypes",
                    template: stLi,
                    templateShareable: true
                },

            });
            cli.addCell(updentitype);
            var updenticont = new Text({
                text: "{jsonModel>entityContainers}",
            });
            cli.addCell(updenticont);
            var updcomtype = new Text({
                text: "{jsonModel>complexTypes}",
            });
            cli.addCell(updcomtype);
            var updassociation = new Text({
                text: "{jsonModel>associations}",
            });
            cli.addCell(updassociation);
            var updschemacol = new Column({
                header: new sap.m.Text({ text: "Schema" })
            });
            var updentitypecol = new Column({
                header: new sap.m.Text({ text: "Entity Type" })
            });
            var updenticontcol = new Column({
                header: new sap.m.Text({ text: "Entity Container" })
            });
            var updcomtypecol = new Column({
                header: new sap.m.Text({ text: "Complex Type" })
            });
            var updassociationcol = new Column({
                header: new sap.m.Text({ text: "Association" })
            });
            var oTable = new Table(this.createId("uploadtable"), {
                items: {
                    path: "jsonModel>/schemas",
                    template: cli
                }
            });
            oTable.addColumn(updschemacol);
            oTable.addColumn(updentitypecol);
            oTable.addColumn(updenticontcol);
            oTable.addColumn(updcomtypecol);
            oTable.addColumn(updassociationcol);

            return oTable;
        },
        oDynamicPage: function () {
            return new DynamicPage({
                headerExpanded: true,
                title: new DynamicPageTitle({
                    heading: [
                        new sap.m.Title({
                            text: "Upload Detail"
                        })
                    ]
                }),
                header: new DynamicPageHeader({
                    content: new sap.m.FlexBox({
                        alignItems: sap.m.FlexAlignItems.Start,
                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                        direction: sap.m.FlexDirection.Row,
                        renderType: sap.m.FlexRendertype.Bare,
                        items: [
                            new sap.m.FlexBox({
                                alignItems: sap.m.FlexAlignItems.Start,
                                justifyContent: sap.m.FlexJustifyContent.Start,
                                direction: sap.m.FlexDirection.Column,
                                renderType: sap.m.FlexRendertype.Bare,
                                items: [
                                    new sap.m.ObjectAttribute({ title: "Created On", text: "01/01/2024" }),
                                    new sap.m.ObjectAttribute({ title: "Created By", text: "John" })
                                ]
                            }),
                        ]
                    })
                }),
                content: this.otable()
            });
        },
        onFileUploadChange: function (oEvent) {
            var aFiles = oEvent.getParameter("files");
            var oFile = aFiles[0];

            // Check if the file with the name 'metadata.xml' already exists
            var oODataModel = this.getView().getModel("odata");
            var aLinks = oODataModel.getProperty("/Links");
            var existingFile = aLinks.find(function (link) {
                return link.linkText === oFile.name;
            });

            if (!existingFile) {
                // File with the name 'metadata.xml' doesn't exist, proceed with upload
                this.handleFileUpload(oFile, aLinks);
            } else {
                var oDialog = new sap.m.Dialog({
                    title: "Already File Exits Alert",
                    type: sap.m.DialogType.Message,
                    content: new sap.m.Text({
                        text: `The ${oFile.name} file already exists.\n Do you want to overwrite your file?\n  Click Ok Button.Otherwise you choose Cancel Button.?`
                    }),
                    beginButton: new sap.m.Button({
                        text: "OK",
                        press: () => {
                            this.handleFileUpload(oFile, aLinks);
                            oDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: () => {
                            this.getView().byId("fileChoosen").setValue("");
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });

                oDialog.open();
            }
        },
        handleFileUpload: function (oFile, aLinks) {
            var oReader = new FileReader();
            oReader.onload = function (e) {
                var sXMLContent = e.target.result;

                // Check if the file with the same name already exists
                var existingFileIndex = aLinks.findIndex(function (link) {
                    return link.linkText === oFile.name;
                });

                if (existingFileIndex === -1) {
                    // File with the same name doesn't exist, add the new file
                    aLinks.push({
                        linkText: oFile.name,
                        fileData: sXMLContent,

                    });
                } else {
                    // File with the same name already exists, prompt for confirmation
                    var oDialog = new sap.m.Dialog({
                        title: "File Overwrite Confirmation",
                        type: sap.m.DialogType.Message,
                        content: new sap.m.Text({
                            text: `File OverWrite`
                        }),
                        beginButton: new sap.m.Button({
                            text: "OK",
                            press: function () {
                                // Overwrite the existing file
                                aLinks[existingFileIndex] = {
                                    linkText: oFile.name,
                                    fileData: sXMLContent
                                };
                                this.getView().getModel("odata").setProperty("/Links", aLinks);
                                this.getView().byId("fileChoosen").setValue("");
                                oDialog.close();
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: () => {
                                this.getView().byId("fileChoosen").setValue("");
                                oDialog.close();
                            }
                        }),
                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();

                    // Exit the function early since the file already exists
                    return;
                }

                // Update the model with the new list of files
                this.getView().getModel("odata").setProperty("/Links", aLinks);

                // Display the link in a List
                var oList = new sap.m.List();
                var oLinkItem = new sap.m.CustomListItem({
                    content: [new sap.m.Link({
                        text: oFile.name,
                        press: this.onLinkPress.bind(this)
                    }),
                    new sap.ui.core.Icon({
                        src: "sap-icon://delete",
                        press: function () {
                            // Handle the delete button press event
                            this.showDeleteConfirmation(oLinkItem);
                        }.bind(this)
                    })
                    ]
                });
                oList.addItem(oLinkItem);

                this.getView().byId("split2").addContent(oList);
                this.getView().byId("fileChoosen").setValue("");
            }.bind(this);

            oReader.readAsText(oFile);
        },
        showDeleteConfirmation: function (oLinkItem) {
            var oTable = oLinkItem.getParent(); // Assuming oLinkItem is a table row item
            var oDialog = new sap.m.Dialog({
                title: "Confirm Deletion",
                type: sap.m.DialogType.Message,
                content: new sap.m.Text({
                    text: "Are you sure you want to delete the link:\n"
                }),
                beginButton: new sap.m.Button({
                    text: "OK",
                    press: () => {
                        var sFileName = oLinkItem.getContent()[0].getText();     // Get the link text (file name)
                        oTable.removeItem(oLinkItem); // Remove the row from the table
                        // Find and remove the file information from the model
                        var oODataModel = this.getView().getModel("odata");
                        var aLinks = oODataModel.getProperty("/Links");
                        var index = aLinks.findIndex(function (link) {
                            return link.linkText === sFileName;
                        });

                        if (index !== -1) {
                            aLinks.splice(index, 1);
                            oODataModel.setProperty("/Links", aLinks);
                        }

                        if (oTable.getItems().length === 0) {
                            // If there are no more items in the table, set the "No Data" text
                            oTable.destroy();
                            //  Clear the model data
                            var oJSONModel = new JSONModel();
                            this.getView().setModel(oJSONModel, "jsonModel");
                            // Refresh the UI
                            this.getView().invalidate();
                        }

                        oDialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        },

        onLinkPress: function (oEvent) {
            var oLink = oEvent.getSource();
            var sODataLink = oLink.getText();

            var oODataModel = this.getView().getModel("odata");
            var aLinks = oODataModel.getProperty("/Links");

            // Find the link object in the model
            var oLinkObject = aLinks.find(function (link) {
                return link.linkText === sODataLink;
            });

            if (oLinkObject) {
                // Access the file data and display it as needed
                var sFileData = oLinkObject.fileData;
                var oParser = new DOMParser();
                var oXMLDocument = oParser.parseFromString(sFileData, "application/xml");

                // Find all schemas
                var aSchemaItems = oXMLDocument.querySelectorAll('Schema');

                var oJsonData = {
                    schemas: []
                };

                aSchemaItems.forEach(function (oSchema, iIndex) {
                    var oSchemaData = {
                        schemaIndex: "Schema",
                        entityTypes: [],
                        entityContainers: [],
                        complexTypes: [],
                        associations: []
                    };

                    // Find entity types in the current schema
                    var aEntityTypeItems = oSchema.querySelectorAll('EntityType');
                    aEntityTypeItems.forEach(function (oEntityType) {
                        var sEntityTypeName = oEntityType.getAttribute('Name');
                        oSchemaData.entityTypes.push(sEntityTypeName);
                    });

                    // Find entity containers in the current schema
                    var aEntityContainerItems = oSchema.querySelectorAll('EntityContainer');
                    aEntityContainerItems.forEach(function (oEntityContainer) {
                        var sEntityContainerName = oEntityContainer.getAttribute('Name');
                        oSchemaData.entityContainers.push(sEntityContainerName);
                    });

                    // Find ComplexType containers in the current schema
                    var aComplexItems = oSchema.querySelectorAll('ComplexType');
                    aComplexItems.forEach(function (ocomplextype) {
                        var sComplexName = ocomplextype.getAttribute('Name');
                        oSchemaData.complexTypes.push(sComplexName);
                    });

                    // Find associations in the current schema
                    var aAssociationItems = oSchema.querySelectorAll('Association');
                    aAssociationItems.forEach(function (oAssociation) {
                        var sAssociationName = oAssociation.getAttribute('Name');
                        oSchemaData.associations.push(sAssociationName);
                    });

                    oJsonData.schemas.push(oSchemaData);
                });

                // Create a JSONModel and set the data
                this.oJsonModel = new JSONModel(oJsonData);
                this.getView().setModel(this.oJsonModel, "jsonModel");

                // Now, you can access the data using the model
                var oModelData = this.oJsonModel.getData();
                console.log("JSON Model Data:", oModelData);

            }
        },
        iconclick: function () {
            console.log("hdjsvhnbjk")

        },

        createTableSplitePanes: function () {
            this.oInnerTablePaneContainer = new PaneContainer({
                orientation: "Horizontal"
            });
            this.oInnerTableSplitPane1 = new sap.ui.layout.SplitPane({
                requiredParentWidth: 600,
                layoutData: new SplitterLayoutData({
                    size: "20%"
                }),
                content: new Page({
                    title: "Select",
                    content: [
                        new sap.m.ComboBox({
                            items: {
                                path: "comboboxitem>/ComboBoxItem",
                                template: new sap.ui.core.ListItem({
                                    key: "{comboboxitem>itemname}",
                                    text: "{comboboxitem>itemname}"
                                }),
                                templateShareable: true
                            },
                            selectionChange: this.multiComboSelection.bind(this)
                        })
                    ]
                })
            });
            this.oInnerTableSplitPane2 = new sap.ui.layout.SplitPane({
                requiredParentWidth: 800,
                layoutData: new SplitterLayoutData({

                }),
                content: new Page({
                    title: "View",
                    content: [
                        new Page(this.createId("muticombotablepage2"), {
                            showHeader: false
                        })
                    ],
                })
            });
            // Add inner split panes to the inner pane container
            this.oInnerTablePaneContainer.addPane(this.oInnerTableSplitPane1);
            this.oInnerTablePaneContainer.addPane(this.oInnerTableSplitPane2);
        },
        multiComboSelection: function (oEvent) {
            var selectedItem = oEvent.getSource().getSelectedItem();
            if (selectedItem) {
                var selectedText = selectedItem.getText();
                var controls = [
                    { name: 'sap.m.Input' },
                    { name: 'sap.m.Button' },
                    { name: 'sap.m.Table' },
                    { name: 'sap.m.CheckBox' }
                ];
                controls.forEach(function (element) {
                    var arrelement = element.name.split(".");
                    if (selectedText === arrelement[2]) {
                        var convertedElement = element.name.split('.').join('/');
                        sap.ui.require([convertedElement], function (classTemplate) {
                            var controlProperties = {};
                            if (selectedText === "Button") {
                                // Set the text property only for buttons
                                controlProperties.text = "Click Me";
                            }
                            if (selectedText === "Input") {
                                // Set the text property only for buttons
                                controlProperties.placeholder = "Type here...";
                            }
                            var oControl = new classTemplate(controlProperties);
                            var ometaData = oControl.getMetadata();
                            this.getView().byId("muticombotablepage2").addContent(oControl);
                            // Check if the selected control is a table
                            if (selectedText === "Table") {
                                // Open the row and column selection dialog
                                this.openRowColumnSelectionDialog();
                            }
                            if (this.currentControl) {
                                this.getView().byId("muticombotablepage2").removeContent(this.currentControl);
                            }
                            // Update the reference to the current control
                            this.currentControl = oControl;
                        }.bind(this));
                    }
                }.bind(this));
            }
        },
        openRowColumnSelectionDialog: function () {
            if (this.oJsonModel) {
                var oModelData = this.oJsonModel.getData();

                if (oModelData.schemas && oModelData.schemas.length > 0) {
                    var allEntityTypes = [];
                    oModelData.schemas.forEach(function (schema) {
                        allEntityTypes = allEntityTypes.concat(schema.entityTypes);
                    });

                    if (allEntityTypes.length > 0) {
                        var oDialog = new sap.m.Dialog({
                            title: "Entity Type Selection",
                            content: [
                                new sap.m.Label({ text: "Select Entity Type:" }),
                                new sap.m.ComboBox({
                                    items: {
                                        path: "jsonModel>/",
                                        template: new sap.ui.core.Item({
                                            key: "{jsonModel>}",
                                            text: "{jsonModel>}"
                                        })
                                    }
                                })
                            ],
                            beginButton: new sap.m.Button({
                                text: "OK",
                                press: function () {
                                    var selectedEntityType = oDialog.getContent()[1].getSelectedItem().getKey();
                                    console.log("Entity Type", selectedEntityType)
                                    // Construct the OData service URL based on the selected entity type
                                    var oDataServiceUrl = "http://localhost:8080/com.klazp.rad.web/MyODataRAD.svc/";

                                    // Create a new instance of ODataModel with the dynamically constructed URL
                                    var odatavecretae = new sap.ui.model.odata.v2.ODataModel(oDataServiceUrl, {
                                        // json: true, // Use JSONP
                                        useBatch: false, // Disable batch requests if needed
                                    })

                                    odatavecretae.metadataLoaded(true).then(
                                        function () {
                                            // model is ready now
                                            console.log(odatavecretae.getServiceMetadata(), "ASDFG");
                                        },
                                        function () {
                                            // Display error information so that the user knows that the application does not work.

                                        });
                                    odatavecretae.read(`/ODataMaterialsEntityContainer.${selectedEntityType + "s"}`, {
                                        success: function (data, response) {
                                            var aData = data.results;
                                            var cleanedData = aData.map(function (item) {
                                                // Use destructuring to create a new object without __metadata
                                                var { __metadata, ...cleanedItem } = item;
                                                return cleanedItem;
                                            });

                                            console.log("Data", cleanedData);

                                            // Create a table
                                            var oTableJsonModel = new sap.ui.model.json.JSONModel();
                                            oTableJsonModel.setData({
                                                items: cleanedData
                                            });

                                            // Create a dynamic table
                                            var odynamicTable = new sap.m.Table({
                                                inset: false,
                                                headerText: "Dynamic Table",
                                                columns: []
                                            });

                                            // Assuming the first item in cleanedData contains column names
                                            var columns = Object.keys(cleanedData[0]);

                                            // Dynamically create columns
                                            columns.forEach(function (column) {
                                                odynamicTable.addColumn(new sap.m.Column({
                                                    header: new sap.m.Label({
                                                        text: column
                                                    }),
                                                }));
                                            });

                                            // Bind the model to the table
                                            odynamicTable.setModel(oTableJsonModel);
                                            odynamicTable.bindItems("/items", new sap.m.ColumnListItem({
                                                cells: columns.map(function (column) {
                                                    return new sap.m.Text().bindProperty("text", column);
                                                })
                                            }));
                                            this.getView().byId("muticombotablepage2").addContent(odynamicTable);
                                        }.bind(this),
                                        error(err) {
                                            console.log("error", err)
                                        }
                                    })
                                    oDialog.close();


                                }.bind(this)
                            }),
                            endButton: new sap.m.Button({
                                text: "Cancel",
                                press: function () {
                                    oDialog.close();
                                }
                            }),
                            afterClose: function () {
                                oDialog.destroy();
                            }
                        });

                        // Create a JSON model for all entity types
                        var allEntityTypesModel = new sap.ui.model.json.JSONModel(allEntityTypes);
                        oDialog.setModel(allEntityTypesModel, "jsonModel");

                        oDialog.open();
                    } else {
                        sap.m.MessageToast.show("No Entity Types found in the JSON model.");
                    }
                } else {
                    sap.m.MessageToast.show("No Schemas found in the JSON model.");
                }
            } else {
                sap.m.MessageToast.show("JSON Model is not available.");
            }
        },
        onButtonClick:function(){
            var inputValue = this.getView().byId("inputurl").getValue();
            console.log("Input value:", inputValue);
            var list = new sap.m.List();
            var listItem = new sap.m.CustomListItem({
                content: [new sap.m.Link({
                    text: inputValue,
                    
                })
            ]
        })
            list.addItem(listItem);
            console.log("1234567",listItem)

            this.getView().byId("split3").addContent(list);  
            this.getView().byId("inputurl").setValue("");


        }


    });
});