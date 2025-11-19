sap.ui.define([
	"com/infocus/vendorAdvance/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/viz/ui5/api/env/Format",
	"com/infocus/vendorAdvance/libs/html2pdf.bundle",
	"jquery.sap.global"
], function(BaseController, Fragment, Filter, FilterOperator, JSONModel, MessageBox, Format, html2pdf_bundle, jQuery) {
	"use strict";

	return BaseController.extend("com.infocus.vendorAdvance.controller.Home", {

		/*************** on Load Functions *****************/
		onInit: function() {
			var oSelectedPanelModel = this.getOwnerComponent().getModel("selectedPanelModel");
			this.getView().setModel(oSelectedPanelModel, "selectedPanelModel");

			// 🔹 Panel-level load cache
			// Initialize panel caches
			this._panelLoadCache = {
				panel1: false,
				panel2: false,
				panel3: false,
				panel4: false,
				panel5: false,
				panel6: false,
				panel7: false,
				panel8: false,
				panelSummary: false
			};

			this._panelTabLoadCache = {
				panel1: {
					scenario1: false
				},
				panel2: {
					scenario2: false,
					scenario3: false,
					scenario4: false
				},
				panel3: {
					scenario5: false,
					scenario6: false,
					scenario7: false
				},
				panel4: {
					scenario8: false,
					scenario9: false,
					scenario10: false
				},
				panel5: {
					scenario11: false,
					scenario12: false,
					scenario13: false
				},
				panel6: {
					scenario14: false,
					scenario15: false,
					scenario16: false
				},
				panel7: {
					scenario17: false,
					scenario18: false,
					scenario19: false
				},
				panel8: {
					scenario20: false,
					scenario21: false,
					scenario22: false
				},
				panelSummary: {
					scenario23: false
				}
			};

			// 🔹 Show default panel1 on load
			this._showSelectedPanel("panel1");

			// 🔹 F8 shortcut
			const that = this;
			document.addEventListener("keydown", function(e) {
				if (e.key === "F8" || e.keyCode === 119) {
					e.preventDefault();
					that.onPress();
				}
			});

			this._initializeApp();
		},

		onBeforeRendering: function() {
			// this._applyColorToVizInPanel("panel3");
			var oSelectedPanelModel = this.getOwnerComponent().getModel("selectedPanelModel");
		},

		// 🔹 Apply a different color palette to each chart

		applyDynamicColorsVendorAdvance: function(sFragmentId, aData, sChartId) {
			var oVizFrame = sap.ui.core.Fragment.byId(this.createId(sFragmentId), sChartId);
			if (!oVizFrame || !Array.isArray(aData) || aData.length === 0) return;

			const dimensionName = "Vendor Name"; // chart shows this field

			// Use LIFNR (vendor ID) for color uniqueness
			var uniqueVendors = [...new Set(aData.map(item => item.Lifnr))];

			// Create a color map using LIFNR
			var colorMap = {};
			uniqueVendors.forEach((lifnr, i) => {
				colorMap[lifnr] = `hsl(${(i * 360) / uniqueVendors.length}, 70%, 50%)`;
			});

			// Define rules based on LIFNR but chart dimension is vendor name
			var rules = aData.map(item => ({
				dataContext: {
					[dimensionName]: item.Lifnr
				},
				properties: {
					color: colorMap[item.Lifnr]
				}
			}));

			// Apply VizFrame properties
			oVizFrame.setVizProperties({
				title: {
					visible: false
				},
				plotArea: {
					dataPointStyle: {
						rules
					},
					drawingEffect: "glossy",
					dataLabel: {
						visible: true,
						position: {
							preferredPosition: "outside",
							alternativePosition: "inside"
						},
						outsidePosition: "top",
						respectPointPosition: true,
						overlapAvoidance: true,
						hideWhenOverlap: false,
						automaticInOutsidePlacement: true,
						formatString: "#,##0.##",
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "12px", // slightly bigger for clarity
							fontWeight: "bold",
							color: "#000"
						}
					},

					// 🔹 Zoomed-in spacing adjustments
					gap: {
						barSpacing: 1.8, // bars become chunkier
						groupSpacing: 2.8 // more separation between bars
					},
					padding: {
						top: 340, // ⬆️ huge top gap for labels
						bottom: 70
					},
					window: {
						start: 0.0,
						end: 0.35 // ⬅️ tighter zoom (~6× zoom effect)
					},
					isFixedDataPointSize: false
				},

				valueAxis: {
					visible: true,
					title: {
						visible: true,
						text: "Amount (₹ L)"
					},
					showSemanticRange: false,
					fixedRange: true,
					minValue: 0,
					maxValue: Math.max(...aData.map(d => d.Netwr)) * 1.8 // +80% top margin for labels
				},

				categoryAxis: {
					label: {
						visible: true,
						rotation: 0,
						angle: 0,
						allowMultiline: false,
						truncatedLabelRatio: 0.9,
						maxWidth: 90,
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "11px",
							fontWeight: "bold"
						}
					}
				},

				legend: {
					visible: false
				},
				tooltip: {
					visible: true
				}
			});

		},

		applyDynamicColorsRXILTOP10: function(sFragmentId, aData, sChartId) {
			var oVizFrame = sap.ui.core.Fragment.byId(this.createId(sFragmentId), sChartId);
			if (!oVizFrame || !Array.isArray(aData) || aData.length === 0) return;

			const dimensionName = "Vendor Name"; // chart shows this field

			// Use LIFNR (vendor ID) for color uniqueness
			var uniqueVendors = [...new Set(aData.map(item => item.Lifnr))];

			// Create a color map using LIFNR
			var colorMap = {};
			uniqueVendors.forEach((lifnr, i) => {
				colorMap[lifnr] = `hsl(${(i * 360) / uniqueVendors.length}, 70%, 50%)`;
			});

			// Define rules based on LIFNR but chart dimension is vendor name
			var rules = aData.map(item => ({
				dataContext: {
					[dimensionName]: `${item.Name1}_${item.Lifnr}` // must match value= field
				},
				properties: {
					color: colorMap[item.Lifnr]
				}
			}));

			// Apply VizFrame properties
			oVizFrame.setVizProperties({
				title: {
					visible: false
				},
				plotArea: {
					dataPointStyle: {
						rules
					},
					drawingEffect: "glossy",
					dataLabel: {
						visible: true,
						position: {
							preferredPosition: "outside",
							alternativePosition: "inside"
						},
						outsidePosition: "top",
						respectPointPosition: true,
						overlapAvoidance: true,
						hideWhenOverlap: false,
						automaticInOutsidePlacement: true,
						formatString: "#,##0.##",
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "12px", // slightly bigger for clarity
							fontWeight: "bold",
							color: "#000"
						}
					},

					// 🔹 Zoomed-in spacing adjustments
					gap: {
						barSpacing: 1.8, // bars become chunkier
						groupSpacing: 2.8 // more separation between bars
					},
					padding: {
						top: 340, // ⬆️ huge top gap for labels
						bottom: 70
					},
					window: {
						start: 0.0,
						end: 0.35 // ⬅️ tighter zoom (~6× zoom effect)
					},
					isFixedDataPointSize: false
				},

				valueAxis: {
					visible: true,
					title: {
						visible: true,
						text: "Amount (₹ L)"
					},
					showSemanticRange: false,
					fixedRange: true,
					minValue: 0,
					maxValue: Math.max(...aData.map(d => d.Netwr)) * 1.8 // +80% top margin for labels
				},

				categoryAxis: {
					label: {
						visible: true,
						rotation: 0,
						angle: 0,
						allowMultiline: false,
						truncatedLabelRatio: 0.9,
						maxWidth: 90,
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "11px",
							fontWeight: "bold"
						}
					}
				},

				legend: {
					visible: false
				},
				tooltip: {
					visible: true
				}
			});

		},

		applyDynamicColorsVendorAdvanceTotal: function(sFragmentId, aData, sChartId) {
			var oVizFrame = sap.ui.core.Fragment.byId(this.createId(sFragmentId), sChartId);
			if (!oVizFrame || !Array.isArray(aData) || aData.length === 0) return;

			const dimensionName = "Company Code"; // must match the dimension name in XML

			// 🔹 Get unique company codes
			var uniqueKeys = [...new Set(aData.map(item => item.Bukrs))];

			// 🔹 Generate distinct HSL colors
			var colorPalette = uniqueKeys.map((key, i) =>
				`hsl(${(i * 360) / uniqueKeys.length}, 70%, 50%)`
			);

			// 🔹 Create data point style rules for each company code
			var rules = uniqueKeys.map((key, i) => ({
				dataContext: {
					[dimensionName]: key
				},
				properties: {
					color: colorPalette[i]
				}
			}));

			// 🔹 Apply viz properties
			oVizFrame.setVizProperties({
				title: {
					visible: false
				},
				plotArea: {
					drawingEffect: "glossy",
					dataLabel: {
						visible: true,
						formatString: "#,##0.##",
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "13px",
							fontWeight: "bold", // ✅ make amount text bold
							color: "#000"
						}
					},
					dataPointStyle: {
						rules
					}
				},
				colorPalette: colorPalette,
				valueAxis: {
					visible: true,
					title: {
						visible: true,
						text: "Amount (₹ L)"
					}
				},
				categoryAxis: {
					title: {
						visible: true,
						text: "Company Code"
					},
					label: {
						visible: true,
						style: {
							fontSize: "10px",
							fontWeight: "bold"
						}
					}
				},
				legend: {
					visible: uniqueKeys.length > 1 // only show if multiple
				},
				tooltip: {
					visible: true
				}
			});
		},

		applyDynamicColorsVendorAdvanceSummary: function(sFragmentId, aData, sChartId) {
			var oVizFrame = sap.ui.core.Fragment.byId(this.createId(sFragmentId), sChartId);
			if (!oVizFrame || !Array.isArray(aData) || aData.length === 0) return;

			const dimensionName = "Type of Vendor Form"; // must match your FlattenedDataset dimension

			// 🔹 Extract unique types
			var uniqueKeys = [...new Set(aData.map(item => item.reportType))];

			// 🔹 Create rules with distinct HSL colors
			var rules = uniqueKeys.map((key, i) => ({
				dataContext: {
					[dimensionName]: key
				},
				properties: {
					color: `hsl(${(i * 360) / uniqueKeys.length}, 70%, 50%)`
				}
			}));

			// 🔹 Apply viz properties
			oVizFrame.setVizProperties({
				title: {
					visible: false
				},
				plotArea: {
					dataPointStyle: {
						rules
					},
					drawingEffect: "glossy",
					dataLabel: {
						visible: true,
						formatString: "#,##0.##", // ✅ formatted numbers
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "11px",
							fontWeight: "bold", // ✅ bold amount labels
							color: "#000"
						}
					}
				},
				valueAxis: {
					visible: true,
					title: {
						visible: true,
						text: "Amount (₹ L)"
					},
					showSemanticRange: false
				},
				categoryAxis: {
					label: {
						visible: true,
						rotation: 0,
						angle: 0,
						allowMultiline: true,
						linesOfWrap: 3,
						maxWidth: 200,
						truncatedLabelRatio: 0.9,
						style: {
							fontFamily: "Arial, sans-serif",
							fontSize: "10px",
							fontWeight: "bold"
						}
					}
				},
				legend: {
					visible: false
				},
				tooltip: {
					visible: true
				}
			});
		},

		/**
		 * Recursively walk the control tree under oParent and call fn on each child.
		 * fn receives (oControl). If fn returns true, we stop traversal for that branch.
		 */

		_initializeApp: function() {
			try {
				this._initializeAppData();
			} catch (err) {
				console.error("Error initializing the app:", err);
				sap.m.MessageBox.error("An error occurred during app initialization. Please contact support.");
			}
		},
		// 1️⃣ Load fragment and add to panel
		_initializeAppData: function() {
			var that = this;
			sap.ui.core.BusyIndicator.show(); // Show busy once

			// Load all datasets in parallel
			Promise.all([
					/* this.getVenderMasterParametersData(), */ // Uncomment if needed
					this.getCompanyCodeMasterParametersData(),
					this.getVenderGroupParametersData() // <-- Load Account Group data here
				])
				.then(function() {
					console.log("All master data loaded successfully.");

					// Optional: inspect Account Group data
					var oAccountGroupModel = that.getOwnerComponent().getModel("accountGroupData");
					console.log("Account Group Data:", oAccountGroupModel.getData());
				})
				.catch(function(err) {
					console.error("Error loading initial data:", err);
					sap.m.MessageBox.error(err);
				})
				.finally(function() {
					sap.ui.core.BusyIndicator.hide(); // Hide busy after all done
				});
		},

		/************* ON AFTER RENDERING FUNCTION ******************/

		/*************** validate Inputs *****************/
		validateInputs: function() {
			var oView = this.getView();

			// Friendly field names
			var mFieldNames = {
				"_companyCodeInputId": "Company Code",
				"_VenderInputId": "Vendor Code",
				"_venderDatePickerId": "Due Date"
			};

			var aInputIds = ["_companyCodeInputId", "_VenderInputId", "_venderDatePickerId"];
			var bAllValid = true;
			var aEmptyFields = [];

			aInputIds.forEach(function(sId) {
				var oInput = oView.byId(sId);
				if (oInput && oInput.getVisible && oInput.getVisible()) {
					var sFieldName = mFieldNames[sId] || sId;
					var bValid = true;

					if (oInput.getDateValue && typeof oInput.getDateValue === "function") {
						var oDate = oInput.getDateValue();
						if (!oDate || Object.prototype.toString.call(oDate) !== "[object Date]" || isNaN(oDate.getTime())) {
							bValid = false;
							oInput.setValueState("Error");
							oInput.setValueStateText("Please select a valid date.");
						} else {
							oInput.setValueState("None");
						}
					} else if (oInput.getValue && typeof oInput.getValue === "function") {
						var sValue = oInput.getValue() ? oInput.getValue().trim() : "";
						if (!sValue) {
							bValid = false;
							oInput.setValueState("Error");
							oInput.setValueStateText("This field cannot be empty.");
						} else {
							oInput.setValueState("None");
						}
					} else {
						var sText = oInput.getText ? oInput.getText() : "";
						if (!sText) {
							bValid = false;
							oInput.setValueState("Error");
							oInput.setValueStateText("This field cannot be empty.");
						} else {
							oInput.setValueState("None");
						}
					}

					if (!bValid) {
						bAllValid = false;
						aEmptyFields.push(sFieldName);
					}
				}
			});

			if (aEmptyFields.length > 0) {
				sap.m.MessageBox.error("Please fill/choose the following fields:\n\n" + aEmptyFields.join("\n"));
			}

			return bAllValid;
		},

		/*************** get parameters data *****************/

		getVenderMasterParametersData: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			var oVenderMasterModel = this.getOwnerComponent().getModel("venderMasterData");
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var aSelectedCompanyCodes = oGlobalData.selectedCompanyCodeIDs || [];
			var sUrl = "/es_f4lifnrset";

			return new Promise(function(resolve, reject) {
				if (!oModel || !oVenderMasterModel) {
					reject("Could not access required models for fetching Vender data.");
					return;
				}

				// Apply filter (bukrs eq '1100')
				var aFilters = [
					new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, aSelectedCompanyCodes[0])
				];

				oModel.read(sUrl, {
					filters: aFilters,
					success: function(oResponse) {
						var aResults = oResponse && oResponse.results ? oResponse.results : [];
						aResults.sort(function(a, b) {
							return parseInt(a.lifnr, 10) - parseInt(b.lifnr, 10);
						});
						oVenderMasterModel.setData(aResults || []);
						console.log("Vender master data loaded:", aResults);
						resolve();
					},
					error: function(oError) {
						console.error("Error fetching Vender master data:", oError);
						reject("Failed to fetch Vender master data.");
					}
				});
			});
		},
		getCompanyCodeMasterParametersData: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			var oCompanyCodeMasterModel = this.getOwnerComponent().getModel("companyCodeMasterData");
			var sUrl = "/es_f4bukrsset";

			return new Promise(function(resolve, reject) {
				if (!oModel || !oCompanyCodeMasterModel) {
					reject("Could not access required models for fetching Company Code data.");
					return;
				}

				oModel.read(sUrl, {
					success: function(oResponse) {
						var aResults = oResponse && oResponse.results ? oResponse.results : [];
						oCompanyCodeMasterModel.setData(aResults || []);
						console.log("Company Code master data loaded:", aResults);
						resolve();
					},
					error: function(oError) {
						console.error("Error fetching Company Code master data:", oError);
						reject("Failed to fetch Company Code master data.");
					}
				});
			});
		},

		// getVenderGroupParametersData: function() {
		// 	var that = this;
		// 	var oModel = this.getOwnerComponent().getModel();
		// 	var oVenderGroupModel = this.getOwnerComponent().getModel("venderGroupData");
		// 	var sUrl = "/es_ven_grpSet";

		// 	return new Promise(function(resolve, reject) {
		// 		if (!oModel || !oVenderGroupModel) {
		// 			reject("Could not access required models for fetching Vendor Group data.");
		// 			return;
		// 		}

		// 		oModel.read(sUrl, {
		// 			success: function(oResponse) {
		// 				var aResults = oResponse && oResponse.results ? oResponse.results : [];
		// 				oVenderGroupModel.setData(aResults || []);
		// 				console.log("Vendor Group master data loaded:", aResults);
		// 				resolve();
		// 			},
		// 			error: function(oError) {
		// 				console.error("Error fetching Vendor Group master data:", oError);
		// 				reject("Failed to fetch Vendor Group master data.");
		// 			}
		// 		});
		// 	});
		// },

		getVenderGroupParametersData: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oAccountGroupModel = this.getOwnerComponent().getModel("accountGroupData");
			var sUrl = "/es_ven_grpSet";

			return new Promise(function(resolve, reject) {
				if (!oModel || !oAccountGroupModel) {
					reject("Could not access required models for fetching Account Group Data.");
					return;
				}

				oModel.read(sUrl, {
					success: function(oResponse) {
						var aResults = oResponse && oResponse.results ? oResponse.results : [];
						oAccountGroupModel.setData(aResults || []);
						console.log("Account Group data loaded:", aResults);
						resolve();
					},
					error: function(oError) {
						console.error("Error fetching Account Group data:", oError);
						reject("Failed to fetch Account Group data.");
					}
				});
			});
		},

		/*************** Fragment handling *****************/

		handleValueVenderMaster: function(oEvent) {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var aSelectedCompanyCodes = oGlobalData.selectedCompanyCodeIDs || [];

			if (!aSelectedCompanyCodes.length) {
				sap.m.MessageBox.error("Please select a Company Code before choosing a Vendor.");
				return;
			}

			var that = this;
			this._VenderInputId = oEvent.getSource().getId();
			var oVenderMasterModel = this.getOwnerComponent().getModel("venderMasterData");
			this._resetCacheOnFilterChange();

			// Lazy-load dialog if not already created
			if (!this._oVenderMasterDialog) {
				this._oVenderMasterDialog = sap.ui.xmlfragment(
					this.getView().getId() + "VenderMasterDialog",
					"com.infocus.vendorAdvance.view.dialogComponent.DialogVenderMaster",
					this
				);
				this._oVenderMasterDialog.setModel(oVenderMasterModel);
				this.getView().addDependent(this._oVenderMasterDialog);
			}

			// Step 1: Show global busy indicator
			sap.ui.core.BusyIndicator.show(0); // 0 = immediately

			// Step 2: Normalize model data
			var aExistingData = oVenderMasterModel.getData();
			if (!Array.isArray(aExistingData)) {
				if (aExistingData && typeof aExistingData === "object") {
					aExistingData = Object.values(aExistingData);
				} else {
					aExistingData = [];
				}
			}

			// Step 3: Check if data for selected company exists
			var bDataForSelectedCompany = aExistingData.some(function(item) {
				return item.bukrs === aSelectedCompanyCodes[0];
			});

			// Step 4: Fetch data only if needed
			var pData = (!aExistingData.length || !bDataForSelectedCompany) ? this.getVenderMasterParametersData() : Promise.resolve();

			pData
				.then(function() {
					// Step 5: Sort ascending by lifnr before opening dialog
					var aDataToSort = oVenderMasterModel.getData();
					if (Array.isArray(aDataToSort)) {
						aDataToSort.sort(function(a, b) {
							if (a.lifnr < b.lifnr) return -1;
							if (a.lifnr > b.lifnr) return 1;
							return 0;
						});
						oVenderMasterModel.setData(aDataToSort);
					}

					// Step 6: Open dialog
					that._oVenderMasterDialog.open();
				})
				.catch(function(err) {
					sap.m.MessageBox.error(err);
				})
				.finally(function() {
					sap.ui.core.BusyIndicator.hide(); // hide global busy
				});
		},

		handleValueCompanyCodeMaster: function(oEvent) {
			var that = this;
			this._CompanyCodeInputId = oEvent.getSource().getId();
			var oCompanyCodeMasterModel = this.getOwnerComponent().getModel("companyCodeMasterData");
			this._resetCacheOnFilterChange();

			if (!this._oCompanyCodeMasterDialog) {
				this._oCompanyCodeMasterDialog = sap.ui.xmlfragment(
					this.getView().getId() + "CompanyCodeMasterDialog",
					"com.infocus.vendorAdvance.view.dialogComponent.DialogCompanyCodeMaster",
					this
				);
				this._oCompanyCodeMasterDialog.setModel(oCompanyCodeMasterModel);
				this.getView().addDependent(this._oCompanyCodeMasterDialog);
			}

			// Show global busy indicator
			sap.ui.core.BusyIndicator.show(0);

			var aExistingData = oCompanyCodeMasterModel.getData();
			if (!Array.isArray(aExistingData)) {
				if (aExistingData && typeof aExistingData === "object") {
					aExistingData = Object.values(aExistingData);
				} else {
					aExistingData = [];
				}
			}

			var pData = (aExistingData.length === 0) ? this.getCompanyCodeMasterParametersData() : Promise.resolve();

			pData
				.then(function() {
					that._oCompanyCodeMasterDialog.open();
				})
				.catch(function(err) {
					sap.m.MessageBox.error(err);
				})
				.finally(function() {
					sap.ui.core.BusyIndicator.hide();
				});
		},

		handleValueAccountGroup: function(oEvent) {
			var that = this;
			this._AccountGroupInputId = oEvent.getSource().getId();

			var oAccountGroupModel = this.getOwnerComponent().getModel("accountGroupData");
			this._resetCacheOnFilterChange();

			// 🧩 Create dialog once
			if (!this._oAccountGroupDialog) {
				this._oAccountGroupDialog = sap.ui.xmlfragment(
					this.getView().getId() + "AccountGroupDialog",
					"com.infocus.vendorAdvance.view.dialogComponent.DialogAccountGroup",
					this
				);
				this._oAccountGroupDialog.setModel(oAccountGroupModel, "accountGroupData");
				this.getView().addDependent(this._oAccountGroupDialog);
			}

			// 🌀 Show busy indicator before loading data
			sap.ui.core.BusyIndicator.show(0);

			// 🧠 Normalize existing data safely
			var aExistingData = oAccountGroupModel.getData();
			if (!Array.isArray(aExistingData)) {
				if (aExistingData && typeof aExistingData === "object") {
					aExistingData = Object.values(aExistingData);
				} else {
					aExistingData = [];
				}
			}

			// 📡 Fetch data only if model is empty
			var pDataPromise = (aExistingData.length === 0) ? this.getVenderGroupParametersData() : Promise.resolve();

			// ✅ Once done, open the dialog
			pDataPromise
				.then(function() {
					that._oAccountGroupDialog.open();
				})
				.catch(function(err) {
					sap.m.MessageBox.error(err || "Failed to fetch Vendor Group data.");
				})
				.finally(function() {
					sap.ui.core.BusyIndicator.hide();
				});
		},

		_loadPanelData: function(sPanelKey, options) {
			options = options || {};
			var bForce = !!options.force;

			if (!sPanelKey) {
				console.warn("⚠️ No panel key provided.");
				return;
			}

			// --- Step 1: Ensure panel defaults are ready ---
			this._initPanelDefaults(sPanelKey);

			// --- Step 2: Skip loading if already cached (unless forced) ---
			if (!bForce && this._panelLoadCache && this._panelLoadCache[sPanelKey]) {
				console.log("⚡ Using cached data for", sPanelKey);
				return;
			}

			console.log((bForce ? "🔁 Forcing reload for" : "📡 Fetching data for"), sPanelKey);

			// --- Step 3: Route to respective backend loaders ---
			switch (sPanelKey) {
				case "panel1":
					this.getBackendDataPanel1();
					break;
				case "panel2":
					this.getBackendDataPanel2();
					break;
				case "panel3":
					this.getBackendDataPanel3();
					break;
				case "panel4":
					this.getBackendDataPanel4();
					break;
				case "panel5":
					this.getBackendDataPanel5();
					break;
				case "panel6":
					this.getBackendDataPanel6();
					break;
				case "panel7":
					this.getBackendDataPanel7();
					break;
				case "panel8":
					this.getBackendDataPanel8();
					break;
				case "panelSummary":
					this.getBackendDataPanelSummary();
					break;
				default:
					console.warn("⚠️ Unknown panel:", sPanelKey);
					return;
			}

			// --- Step 4: Mark this panel as loaded in cache (respecting force)
			if (!this._panelLoadCache) {
				this._panelLoadCache = {};
			}
			this._panelLoadCache[sPanelKey] = true;
		},

		_initPanelDefaults: function(sPanelKey) {
			const oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;
			const oData = oGlobalDataModel.getData();

			switch (sPanelKey) {
				// 🔹 Panel 1 – Overview / Vendor History / Base Panel
				case "panel1":
					if (!oData.selectedPanel1TabKey) {
						oGlobalDataModel.setProperty("/selectedPanel1TabKey", "scenario1");
						oGlobalDataModel.setProperty("/isChartFragment1Visible", true);
						console.log("🌱 Initialized defaults for Panel1");
					}
					break;
					// 🔹 Panel 2 – Vendor Advance
				case "panel2":
					if (!oData.selectedVendorTabKey) {
						oGlobalDataModel.setProperty("/selectedVendorTabKey", "scenario2");
						oGlobalDataModel.setProperty("/isChartFragment2Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment3Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment4Visible", false);
						console.log("🌱 Initialized defaults for Panel2");
					}
					break;

					// 🔹 Panel 3 – Creditor
				case "panel3":
					if (!oData.selectedCreditorTabKey) {
						oGlobalDataModel.setProperty("/selectedCreditorTabKey", "scenario5");
						oGlobalDataModel.setProperty("/isChartFragment5Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment6Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment7Visible", false);
						console.log("🌱 Initialized defaults for Panel3");
					}
					break;

					// 🔹 Panel 4 – LC
				case "panel4":
					if (!oData.selectedLCTabKey) {
						oGlobalDataModel.setProperty("/selectedLCTabKey", "scenario8");
						oGlobalDataModel.setProperty("/isChartFragment8Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment9Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment10Visible", false);
						console.log("🌱 Initialized defaults for Panel4");
					}
					break;

					// 🔹 Panel 5 – Factoring
				case "panel5":
					if (!oData.selectedFactoringTabKey) {
						oGlobalDataModel.setProperty("/selectedFactoringTabKey", "scenario11");
						oGlobalDataModel.setProperty("/isChartFragment11Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment12Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment13Visible", false);
						console.log("🌱 Initialized defaults for Panel5");
					}
					break;

					// 🔹 Panel 6 – RXIL
				case "panel6":
					if (!oData.selectedRXILTabKey) {
						oGlobalDataModel.setProperty("/selectedRXILTabKey", "scenario14");
						oGlobalDataModel.setProperty("/isChartFragment14Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment15Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment16Visible", false);
						console.log("🌱 Initialized defaults for Panel6");
					}
					break;

					// 🔹 Panel 7 – ABG
				case "panel7":
					if (!oData.selectedABGTabKey) {
						oGlobalDataModel.setProperty("/selectedABGTabKey", "scenario17");
						oGlobalDataModel.setProperty("/isChartFragment17Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment18Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment19Visible", false);
						console.log("🌱 Initialized defaults for Panel7");
					}
					break;

					// 🔹 Panel 8 – PBG
				case "panel8":
					if (!oData.selectedPBGTabKey) {
						oGlobalDataModel.setProperty("/selectedPBGTabKey", "scenario20");
						oGlobalDataModel.setProperty("/isChartFragment20Visible", true);
						oGlobalDataModel.setProperty("/isChartFragment21Visible", false);
						oGlobalDataModel.setProperty("/isChartFragment22Visible", false);
						console.log("🌱 Initialized defaults for Panel8");
					}
					break;

					// 🔹 Panel Summary
				case "panelSummary":
					if (!oData.selectedSummaryTabKey) {
						oGlobalDataModel.setProperty("/selectedSummaryTabKey", "scenario23");
						oGlobalDataModel.setProperty("/isChartFragmentSummaryVisible", true);
						console.log("🌱 Initialized defaults for Summary Panel");
					}
					break;

				default:
					console.log("ℹ️ No default init defined for", sPanelKey);
					break;
			}
		},

		/**
		 * When you manually change panels in the dropdown,
		 * just show the selected one — no backend call here.
		 */
		handleReportTypeChange: function(oEvent) {
			const oItem = oEvent.getParameter("selectedItem");
			if (!oItem) {
				console.warn("⚠️ No item selected in report type dropdown");
				return;
			}
			const sSelectedKey = oItem.getKey();
			if (!sSelectedKey) {
				console.warn("⚠️ Selected key is empty");
				return;
			}
			this._showSelectedPanel(sSelectedKey);
		},

		/**
		 * Manage visibility of panels
		 */
		_showSelectedPanel: function(sPanelKey) {
			sPanelKey = sPanelKey || "panel1"; // fallback to default

			if (!sPanelKey) {
				console.warn("⚠️ No panel key provided.");
				return;
			}

			const aPanels = [
				"panel1", "panel2", "panel3", "panel4",
				"panel5", "panel6", "panel7", "panel8", "panelSummary"
			];

			// 🔹 Show/hide panels
			aPanels.forEach(id => {
				const oPanel = this.byId(id);
				if (oPanel) oPanel.setVisible(id === sPanelKey);
			});

			// 🔹 Update selected panel model
			const oSelectedPanelModel = this.getView().getModel("selectedPanelModel");
			if (oSelectedPanelModel) {
				oSelectedPanelModel.setProperty("/selectedPanel", sPanelKey);
			}
		},

		/******************* Panel Handling **************/
		/******************* Panel Handling with caching **************/

		onTabSelectPanel1: function(oEvent) {
			const oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			const sSelectedKey = oEvent.getParameter("selectedKey") || "scenario1";
			oGlobalDataModel.setProperty("/selectedCreditorTabKey", sSelectedKey);

			// 🔹 Hide all fragments (only one for now)
			oGlobalDataModel.setProperty("/isChartFragment1Visible", false);

			// 🔹 Ensure panel1 cache object exists
			this._panelTabLoadCache.panel1 = this._panelTabLoadCache.panel1 || {};

			if (!this._panelTabLoadCache.panel1[sSelectedKey]) {
				// First time loading data for this tab
				switch (sSelectedKey) {
					case "scenario1":
						oGlobalDataModel.setProperty("/isChartFragment1Visible", true);
						this.getStillToDeliveredData(); // <-- your backend/data loader function
						break;
				}
				this._panelTabLoadCache.panel1[sSelectedKey] = true;
				console.log("📡 Fetched data for panel1:", sSelectedKey);
			} else {
				// Cached data already available
				switch (sSelectedKey) {
					case "scenario1":
						oGlobalDataModel.setProperty("/isChartFragment1Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel1:", sSelectedKey);
			}
		},

		onTabSelectPanel2: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedVendorTabKey", sSelectedKey);

			// Hide all fragments first
			oGlobalDataModel.setProperty("/isChartFragment2Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment3Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment4Visible", false);

			if (!this._panelTabLoadCache.panel2[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario2":
						oGlobalDataModel.setProperty("/isChartFragment2Visible", true);
						this.getVendorAdvanceData();
						break;
					case "scenario3":
						oGlobalDataModel.setProperty("/isChartFragment3Visible", true);
						this.getTop10VendorAdvanceData();
						break;
					case "scenario4":
						oGlobalDataModel.setProperty("/isChartFragment4Visible", true);
						this.getTotalVendorAdvanceData();
						break;
				}
				this._panelTabLoadCache.panel2[sSelectedKey] = true;
			} else {
				// Already loaded, just show fragment
				switch (sSelectedKey) {
					case "scenario2":
						oGlobalDataModel.setProperty("/isChartFragment2Visible", true);
						break;
					case "scenario3":
						oGlobalDataModel.setProperty("/isChartFragment3Visible", true);
						break;
					case "scenario4":
						oGlobalDataModel.setProperty("/isChartFragment4Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel2:", sSelectedKey);
			}
		},

		onTabSelectPanel3: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedCreditorTabKey", sSelectedKey);

			// Hide all fragments first
			oGlobalDataModel.setProperty("/isChartFragment5Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment6Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment7Visible", false);

			if (!this._panelTabLoadCache.panel3[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario5":
						oGlobalDataModel.setProperty("/isChartFragment5Visible", true);
						this.getCreditorData();
						break;
					case "scenario6":
						oGlobalDataModel.setProperty("/isChartFragment6Visible", true);
						this.getTop10CreditorData();
						break;
					case "scenario7":
						oGlobalDataModel.setProperty("/isChartFragment7Visible", true);
						this.getTotalCreditorData();
						break;
				}
				this._panelTabLoadCache.panel3[sSelectedKey] = true;
			} else {
				switch (sSelectedKey) {
					case "scenario5":
						oGlobalDataModel.setProperty("/isChartFragment5Visible", true);
						break;
					case "scenario6":
						oGlobalDataModel.setProperty("/isChartFragment6Visible", true);
						break;
					case "scenario7":
						oGlobalDataModel.setProperty("/isChartFragment7Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel3:", sSelectedKey);
			}
		},

		onTabSelectPanel4: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedLCTabKey", sSelectedKey);

			oGlobalDataModel.setProperty("/isChartFragment8Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment9Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment10Visible", false);

			if (!this._panelTabLoadCache.panel4[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario8":
						oGlobalDataModel.setProperty("/isChartFragment8Visible", true);
						this.getLCData();
						break;
					case "scenario9":
						oGlobalDataModel.setProperty("/isChartFragment9Visible", true);
						this.getTop10LCData();
						break;
					case "scenario10":
						oGlobalDataModel.setProperty("/isChartFragment10Visible", true);
						this.getTotalLCData();
						break;
				}
				this._panelTabLoadCache.panel4[sSelectedKey] = true;
			} else {
				switch (sSelectedKey) {
					case "scenario8":
						oGlobalDataModel.setProperty("/isChartFragment8Visible", true);
						break;
					case "scenario9":
						oGlobalDataModel.setProperty("/isChartFragment9Visible", true);
						break;
					case "scenario10":
						oGlobalDataModel.setProperty("/isChartFragment10Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel4:", sSelectedKey);
			}
		},

		onTabSelectPanel5: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedFactoringTabKey", sSelectedKey);

			oGlobalDataModel.setProperty("/isChartFragment11Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment12Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment13Visible", false);

			if (!this._panelTabLoadCache.panel5[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario11":
						oGlobalDataModel.setProperty("/isChartFragment11Visible", true);
						this.getFactoringData();
						break;
					case "scenario12":
						oGlobalDataModel.setProperty("/isChartFragment12Visible", true);
						this.getTop10FactoringData();
						break;
					case "scenario13":
						oGlobalDataModel.setProperty("/isChartFragment13Visible", true);
						this.getTotalFactoringData();
						break;
				}
				this._panelTabLoadCache.panel5[sSelectedKey] = true;
			} else {
				switch (sSelectedKey) {
					case "scenario11":
						oGlobalDataModel.setProperty("/isChartFragment11Visible", true);
						break;
					case "scenario12":
						oGlobalDataModel.setProperty("/isChartFragment12Visible", true);
						break;
					case "scenario13":
						oGlobalDataModel.setProperty("/isChartFragment13Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel5:", sSelectedKey);
			}
		},

		onTabSelectPanel6: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedRXILTabKey", sSelectedKey);

			oGlobalDataModel.setProperty("/isChartFragment14Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment15Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment16Visible", false);

			if (!this._panelTabLoadCache.panel6[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario14":
						oGlobalDataModel.setProperty("/isChartFragment14Visible", true);
						this.getRXILData();
						break;
					case "scenario15":
						oGlobalDataModel.setProperty("/isChartFragment15Visible", true);
						this.getTop10RXILData();
						break;
					case "scenario16":
						oGlobalDataModel.setProperty("/isChartFragment16Visible", true);
						this.getTotalRXILData();
						break;
				}
				this._panelTabLoadCache.panel6[sSelectedKey] = true;
			} else {
				switch (sSelectedKey) {
					case "scenario14":
						oGlobalDataModel.setProperty("/isChartFragment14Visible", true);
						break;
					case "scenario15":
						oGlobalDataModel.setProperty("/isChartFragment15Visible", true);
						break;
					case "scenario16":
						oGlobalDataModel.setProperty("/isChartFragment16Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel6:", sSelectedKey);
			}
		},

		onTabSelectPanel7: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedABGTabKey", sSelectedKey);

			oGlobalDataModel.setProperty("/isChartFragment17Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment18Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment19Visible", false);

			if (!this._panelTabLoadCache.panel7[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario17":
						oGlobalDataModel.setProperty("/isChartFragment17Visible", true);
						this.getABGData();
						break;
					case "scenario18":
						oGlobalDataModel.setProperty("/isChartFragment18Visible", true);
						this.getTop10ABGData();
						break;
					case "scenario19":
						oGlobalDataModel.setProperty("/isChartFragment19Visible", true);
						this.getTotalABGData();
						break;
				}
				this._panelTabLoadCache.panel7[sSelectedKey] = true;
			} else {
				switch (sSelectedKey) {
					case "scenario17":
						oGlobalDataModel.setProperty("/isChartFragment17Visible", true);
						break;
					case "scenario18":
						oGlobalDataModel.setProperty("/isChartFragment18Visible", true);
						break;
					case "scenario19":
						oGlobalDataModel.setProperty("/isChartFragment19Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel7:", sSelectedKey);
			}
		},

		onTabSelectPanel8: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;

			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedPBGTabKey", sSelectedKey);

			oGlobalDataModel.setProperty("/isChartFragment20Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment21Visible", false);
			oGlobalDataModel.setProperty("/isChartFragment22Visible", false);

			if (!this._panelTabLoadCache.panel8[sSelectedKey]) {
				switch (sSelectedKey) {
					case "scenario20":
						oGlobalDataModel.setProperty("/isChartFragment20Visible", true);
						this.getPBGData();
						break;
					case "scenario21":
						oGlobalDataModel.setProperty("/isChartFragment21Visible", true);
						this.getTop10PBGData();
						break;
					case "scenario22":
						oGlobalDataModel.setProperty("/isChartFragment22Visible", true);
						this.getTotalPBGData();
						break;
				}
				this._panelTabLoadCache.panel8[sSelectedKey] = true;
			} else {
				switch (sSelectedKey) {
					case "scenario20":
						oGlobalDataModel.setProperty("/isChartFragment20Visible", true);
						break;
					case "scenario21":
						oGlobalDataModel.setProperty("/isChartFragment21Visible", true);
						break;
					case "scenario22":
						oGlobalDataModel.setProperty("/isChartFragment22Visible", true);
						break;
				}
				console.log("⚡ Using cached data for panel8:", sSelectedKey);
			}
		},

		onTabSelectPanelSummary: function(oEvent) {
			var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
			if (!oGlobalDataModel) return;
			var sSelectedKey = oEvent.getParameter("selectedKey");
			oGlobalDataModel.setProperty("/selectedSummaryTabKey", sSelectedKey);

			// panelSummary has only one scenario
			oGlobalDataModel.setProperty("/isChartFragmentSummaryVisible", true);

			if (!this._panelTabLoadCache.panelSummary["scenario23"]) {
				this.getSummaryData();
				this._panelTabLoadCache.panelSummary["scenario23"] = true;
			} else {
				console.log("⚡ Using cached data for panelSummary: scenario23");
			}
		},

		/*************** get the Icontabfilter select updated in global model  *****************/

		// onTabSelectPanel2: function(oEvent) {
		// 	var oGlobalDataModel = this.getOwnerComponent().getModel("globalData");
		// 	var oPanel2 = this.getView().byId("panel2");

		// 	// Get the selected tab key
		// 	var sSelectedKey = oEvent.getParameter("selectedKey");

		// 	// Define mapping of keys to fragment visibility properties
		// 	var oFragmentVisibilityMapping = {
		// 		"scenario2": "isChartFragment2Visible", // Vendor Advance
		// 		"scenario3": "isChartFragment3Visible", // Top 10 Vendor Advance
		// 		"scenario4": "isChartFragment4Visible" // Total Vendor Advance
		// 	};

		// 	// First, hide all fragments
		// 	Object.values(oFragmentVisibilityMapping).forEach(function(sProperty) {
		// 		oGlobalDataModel.setProperty("/" + sProperty, false);
		// 	});

		// 	// Then show the selected fragment
		// 	if (oFragmentVisibilityMapping[sSelectedKey]) {
		// 		oGlobalDataModel.setProperty("/" + oFragmentVisibilityMapping[sSelectedKey], true);
		// 	}

		// 	// Optional: store selected tab key or text for reference
		// 	oGlobalDataModel.setProperty("/selectedVendorTabKey", sSelectedKey);
		// },

		/*************OnPress************************/

		onPress: function() {
			const oGlobalModel = this.getView().getModel("globalData");
			const oSelectedPanelModel = this.getView().getModel("selectedPanelModel");

			// Fetch filter values
			const sCompanyCode = oGlobalModel.getProperty("/selectedCompanyCodeNamesDisplay");
			const sVendorCode = oGlobalModel.getProperty("/selectedVenderNamesDisplay");
			const sAccountGroup = oGlobalModel.getProperty("/selectedAccountGroupDisplay");
			const sVendorDate = oGlobalModel.getProperty("/selectedVenderDate");
			const sSelectedPanel = oSelectedPanelModel.getProperty("/selectedPanel");

			// 🔹 Validate mandatory filters
			if (!sCompanyCode) {
				sap.m.MessageBox.warning("Please select a Company Code");
				return;
			}
			if (!sVendorDate) {
				sap.m.MessageBox.warning("Please select a Vendor Date");
				return;
			}

			// Optional filters (no blocking)
			if (!sVendorCode) console.log("ℹ️ Vendor Code not selected – proceeding with all vendors.");
			if (!sAccountGroup) console.log("ℹ️ Account Group not selected – proceeding with all groups.");

			// 🔹 Detect if filters changed (to control cache reset)
			const oNewFilterSet = {
				sCompanyCode,
				sVendorCode,
				sAccountGroup,
				sVendorDate
			};
			const bFilterChanged = JSON.stringify(oNewFilterSet) !== JSON.stringify(this._lastFilterSet);

			if (bFilterChanged) {
				this._clearAllPanelModels();
				this._resetCacheOnFilterChange();
				this._lastFilterSet = oNewFilterSet; // Remember new filter set
			}

			// ✅ Handle repeated press with no data
			if (!bFilterChanged && this._lastLoadHadNoData) {
				sap.m.MessageBox.information("No data available for the selected parameters.");
				return;
			}

			// ✅ Proceed to backend or cached load
			// ✅ Proceed to load data (from backend or cache)
			this._loadPanelData(sSelectedPanel, oNewFilterSet);

		},

		/***********************  STILL TO BE DELIVERED BACKEND CALL  **************************/

		getBackendDataPanel1: function() {
			const oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			const sSelectedTabKey = oGlobalData.selectedPanel1TabKey || "scenario1";

			if (!sSelectedTabKey) return; // no tab selected (shouldn't happen)

			if (sSelectedTabKey === "scenario1") {
				this.getStillToDeliverData(); // 🔹 call your backend/data loader for Panel1
			}
		},

		getStillToDeliverData: function() {
			const oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			const oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			const oStillDataModel = this.getOwnerComponent().getModel("stillToDeliverData");
			const that = this;

			console.log("🚀 getStillToDeliverData started with:", oGlobalData);

			try {
				// --- Build filters using helper ---
				const aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array (Still To Deliver):", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// --- Combine all filters with AND ---
				const oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_ven_still_delSet", {
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Still to Deliver Data Loaded:", oData.results);

						// 🔹 Check for empty data
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("stillToDeliverData", "Still to Deliver");
							return;
						}

						// 🔹 Convert Netwr → Lakhs
						// ✅ Normalize minus values before formatting
						const aCleanedData = that.normalizeMinusValues(oData.results, ["Netwr"]);

						// ✅ Convert to lakhs after cleanup
						const aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Netwr"]);

						// 🔹 Bind processed data to model
						oStillDataModel.setData(aConvertedData);

						// 🔹 Apply chart coloring
						that.applyDynamicColorsVendorAdvance(
							"chartFragment1",
							oData.results,
							"idStillToDeliverChart"
						);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Still to Deliver):", oError);
						sap.m.MessageBox.error("Error fetching 'Still to Deliver' data!");
					}
				});
			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getStillToDeliverData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching 'Still to Deliver' data.");
			}
		},

		/***********************  VENDOR ADVANCE BACKEND CALL  **************************/

		getBackendDataPanel2: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedVendorTabKey;

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario2") this.getVendorAdvanceData();
			else if (sSelectedTabKey === "scenario3") this.getTop10VendorAdvanceData();
			else if (sSelectedTabKey === "scenario4") this.getTotalVendorAdvanceData();
		},

		_buildVendorAdvanceFilters: function(oGlobalData) {
			console.log("🧩 _buildVendorAdvanceFilters called with:", oGlobalData);

			try {
				const aMainFilters = [];

				// --- Company Code (Bukrs) ---
				if (Array.isArray(oGlobalData.selectedCompanyCodeIDs) && oGlobalData.selectedCompanyCodeIDs.length > 0) {
					const bukrsFilters = oGlobalData.selectedCompanyCodeIDs
						.filter(Boolean)
						.map(b => new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, b));
					if (bukrsFilters.length > 0) {
						aMainFilters.push(bukrsFilters.length > 1 ? new sap.ui.model.Filter(bukrsFilters, false) : bukrsFilters[0]);
					}
				}

				// --- Account Group (Ktokk) ---
				if (Array.isArray(oGlobalData.selectedAccountGroupIDs) && oGlobalData.selectedAccountGroupIDs.length > 0) {
					const ktokkFilters = oGlobalData.selectedAccountGroupIDs
						.filter(Boolean)
						.map(k => new sap.ui.model.Filter("Ktokk", sap.ui.model.FilterOperator.EQ, k));
					if (ktokkFilters.length > 0) {
						aMainFilters.push(ktokkFilters.length > 1 ? new sap.ui.model.Filter(ktokkFilters, false) : ktokkFilters[0]);
					}
				}

				// --- Vendor (Lifnr) ---
				if (Array.isArray(oGlobalData.selectedVenderIDs) && oGlobalData.selectedVenderIDs.length > 0) {
					const aVendorIDs = oGlobalData.selectedVenderIDs.filter(Boolean);

					if (oGlobalData.useVendorRange && aVendorIDs.length > 1) {
						// Force GE–LE range if user wants range
						const sorted = aVendorIDs.slice().sort();
						console.log("📊 Vendor Range (GE-LE):", sorted[0], "to", sorted[sorted.length - 1]);
						aMainFilters.push(new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.BT, sorted[0], sorted[sorted.length - 1]));
					} else if (aVendorIDs.length === 1) {
						aMainFilters.push(new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, aVendorIDs[0]));
					} else if (aVendorIDs.length <= 50) {
						const lifnrFilters = aVendorIDs.map(l => new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, l));
						aMainFilters.push(new sap.ui.model.Filter(lifnrFilters, false)); // OR
					} else {
						// If >50 but no explicit range, fallback to BT using min/max
						const sorted = aVendorIDs.slice().sort();
						console.log("📊 Vendor Fallback Range:", sorted[0], "to", sorted[sorted.length - 1]);
						aMainFilters.push(new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.BT, sorted[0], sorted[sorted.length - 1]));
					}
				}

				// --- Vendor Date (Budat) ---
				if (oGlobalData.selectedVenderDate) {
					aMainFilters.push(new sap.ui.model.Filter("Budat", sap.ui.model.FilterOperator.EQ, oGlobalData.selectedVenderDate));
				}

				// --- Wrap everything in AND ---
				if (aMainFilters.length === 0) {
					console.warn("⚠️ No filters built");
					return [];
				}

				const oFinalFilter = new sap.ui.model.Filter(aMainFilters, true);
				console.log("🧠 Final Combined Filter:", oFinalFilter);
				return [oFinalFilter];

			} catch (err) {
				console.error("❌ Error building filters:", err);
				return [];
			}
		},

		/**
		 * Convert numeric fields (including nested) in an array of objects to lakhs.
		 * @param {Array} aData - Array of OData results
		 * @param {Array} aFields - Fields to convert, can be nested like "Vendor.Amount"
		 * @returns {Array} - New array with converted values
		 */
		formatAmountsToLakhs: function(aData, aFields) {
			if (!aData || !Array.isArray(aData)) return [];
			if (!aFields || !Array.isArray(aFields)) return aData;

			return aData.map(function(oItem) {
				var oCopy = Object.assign({}, oItem); // shallow copy

				aFields.forEach(function(sField) {
					var parts = sField.split("."); // support nested fields
					var obj = oCopy;
					for (var i = 0; i < parts.length - 1; i++) {
						obj = obj[parts[i]];
						if (!obj) break;
					}
					var lastKey = parts[parts.length - 1];
					if (obj && obj[lastKey] !== undefined && !isNaN(obj[lastKey])) {
						var valueInLakhs = parseFloat(obj[lastKey]) / 100000;
						// Round to 2 decimal places using standard rounding
						obj[lastKey] = Math.round(valueInLakhs * 100) / 100;
					}
				});

				return oCopy;
			});
		},

		getVendorAdvanceData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oVendorAdvanceModel = this.getOwnerComponent().getModel("vendorAdvanceData");
			var that = this;

			console.log("🚀 getVendorAdvanceData started with:", oGlobalData);

			try {
				// --- Build filters using helper ---
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array:", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// Combine all filters with AND
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_ven_advnSet", {
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Vendor Advance Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("vendorAdvanceData", "Vendor Advance");
							return;
						}

						// Call helper to convert nested amounts to lakhs
						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["vend_adv"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["vend_adv"]);

						oVendorAdvanceModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment2", oData.results, "idVendorAdvanceChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error:", oError);
						sap.m.MessageBox.error("Error fetching Vendor Advance data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getVendorAdvanceData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Vendor Advance data.");
			}
		},

		getTop10VendorAdvanceData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10Model = this.getOwnerComponent().getModel("top10VendorAdvanceData"); // make sure this model exists
			var that = this;

			console.log("🚀 getTop10VendorAdvanceData started with:", oGlobalData);

			try {
				// --- Build filters using the same helper ---
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array for Top 10:", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// Combine all filters with AND
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object for Top 10:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_top_tenSet", { // ✅ Top 10 entity
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Top 10 Vendor Advance Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10VendorAdvanceData", "Top 10 Vendor Advance");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["vend_adv"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["vend_adv"]);

						oTop10Model.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment3", oData.results, "idTop10VendorChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10):", oError);
						sap.m.MessageBox.error("Error fetching Top 10 Vendor Advance data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10VendorAdvanceData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 Vendor Advance data.");
			}
		},

		getTotalVendorAdvanceData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalVendorAdvanceModel = this.getOwnerComponent().getModel("totalVendorAdvanceData");
			var that = this;

			console.log("🚀 getTotalVendorAdvanceData started with:", oGlobalData);

			try {
				// --- Build filters using the same helper ---
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array for Total:", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// Combine all filters with AND
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object for Total:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_ven_totalSet", { // ✅ Use totalSet endpoint
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Total Vendor Advance Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalVendorAdvanceData", "Total Vendor Advance");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment4", oData.results, "idTotalVendorAdvanceChart");
						oTotalVendorAdvanceModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total):", oError);
						sap.m.MessageBox.error("Error fetching Total Vendor Advance data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalVendorAdvanceData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total Vendor Advance data.");
			}
		},

		/*********************** CREDITOR BACKEND CALL ***********************/

		getBackendDataPanel3: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedCreditorTabKey;

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario5") this.getCreditorData();
			else if (sSelectedTabKey === "scenario6") this.getTop10CreditorData();
			else if (sSelectedTabKey === "scenario7") this.getTotalCreditorData();
		},

		getCreditorData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oCreditorModel = this.getOwnerComponent().getModel("creditorData");
			var that = this;

			console.log("🚀 getCreditorData started with:", oGlobalData);

			try {
				// --- Build filters using helper ---
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array:", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// Combine all filters with AND
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_ven_creditSet", {
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Creditor Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("creditorData", "Creditor");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Creditor"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Creditor"]);

						oCreditorModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment5", oData.results, "idCreditorChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error:", oError);
						sap.m.MessageBox.error("Error fetching Creditor data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getCreditorData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Creditor data.");
			}
		},

		getTop10CreditorData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10CreditorModel = this.getOwnerComponent().getModel("top10CreditorData"); // make sure this model exists
			var that = this;

			console.log("🚀 getTop10CreditorData started with:", oGlobalData);

			try {
				// --- Build filters using the same helper ---
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array for Top 10:", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// Combine all filters with AND
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object for Top 10:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_credit_tenSet", { // ✅ Top 10 entity
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Top 10 Creditor Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10CreditorData", "Top 10 Creditor");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Creditor"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Creditor"]);

						oTop10CreditorModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment6", oData.results, "idTop10CreditorChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10):", oError);
						sap.m.MessageBox.error("Error fetching Top 10 Creditor data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10CreditorData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 Creditor data.");
			}
		},

		getTotalCreditorData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalCreditorModel = this.getOwnerComponent().getModel("totalCreditorData");
			var that = this;

			console.log("🚀 getTotalCreditorData started with:", oGlobalData);

			try {
				// --- Build filters using the same helper ---
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				console.log("🧱 Final Filter Array for Total:", aFilters);

				// --- Handle empty filters ---
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				// Combine all filters with AND
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);
				console.log("🔍 Final Combined Filter Object for Total:", oFinalFilter);

				// --- Execute OData call ---
				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_credit_totalSet", { // ✅ Use totalSet endpoint
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Total Creditor Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalCreditorData", "Total Creditor");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment7", oData.results, "idTotalCreditorChart");

						oTotalCreditorModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total):", oError);
						sap.m.MessageBox.error("Error fetching Total Creditor data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalCreditorData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total Creditor data.");
			}
		},

		/*********************** LC BACKEND CALL ***********************/

		getBackendDataPanel4: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedLCTabKey; // make sure you bind selectedKey to this property

			if (!sSelectedTabKey) return; // no tab selected

			switch (sSelectedTabKey) {
				case "scenario8": // LC all vendors
					this.getLCData();
					break;
				case "scenario9": // LC Top 10
					this.getTop10LCData();
					break;
				case "scenario10": // LC Total
					this.getTotalLCData();
					break;
				default:
					console.warn("No matching LC scenario for key:", sSelectedTabKey);
			}
		},

		getLCData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oLCModel = this.getOwnerComponent().getModel("lcData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getLCData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_ven_lcSet", { // ✅ All Vendor LC
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("LC Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("lcData", "LC");
							return;
						}
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Lc"]);

						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Lc"]);

						oLCModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment8", oData.results, "idLCChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (LC):", oError);
						sap.m.MessageBox.error("Error fetching LC data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getLCData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching LC data.");
			}
		},

		getTop10LCData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10LCModel = this.getOwnerComponent().getModel("top10LCData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTop10LCData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_lc_tenSet", { // ✅ Top 10 LC
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Top 10 LC Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10LCData", "Top 10 LC");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Lc"]);

						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Lc"]);

						oTop10LCModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment9", oData.results, "idTop10LCChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10 LC):", oError);
						sap.m.MessageBox.error("Error fetching Top 10 LC data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10LCData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 LC data.");
			}
		},

		getTotalLCData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalLCModel = this.getOwnerComponent().getModel("totalLCData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTotalLCData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_lc_totalSet", { // ✅ Total LC
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Total LC Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalLCData", "Total LC");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment10", oData.results, "idTotalLCChart");

						oTotalLCModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total LC):", oError);
						sap.m.MessageBox.error("Error fetching Total LC data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalLCData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total LC data.");
			}
		},

		/*********************** FACTORING BACKEND CALL ***********************/
		getBackendDataPanel5: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedFactoringTabKey;

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario11") this.getFactoringData();
			else if (sSelectedTabKey === "scenario12") this.getTop10FactoringData();
			else if (sSelectedTabKey === "scenario13") this.getTotalFactoringData();
		},

		getFactoringData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oFactoringModel = this.getOwnerComponent().getModel("factoringData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getFactoringData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_ven_factocSet", { // ✅ All Vendor LC
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Factoring Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("factoringData", "Factoring");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Factoring"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Factoring"]);

						oFactoringModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment11", oData.results, "idFactoringChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error Factoring:", oError);
						sap.m.MessageBox.error("Error fetching Factoring data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getFactoringData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Factoring data.");
			}
		},

		getTop10FactoringData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10FactoringModel = this.getOwnerComponent().getModel("top10FactoringData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTop10FactoringData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_factor_tenSet", { // ✅ Top 10 LC
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Top 10 Factoring Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10FactoringData", "Top 10 Factoring");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Factoring"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Factoring"]);

						oTop10FactoringModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment12", oData.results, "idTop10FactoringChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10 Factoring:", oError);
						sap.m.MessageBox.error("Error fetching Top 10 Factoring data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10FactoringData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 Factoring data.");
			}
		},

		getTotalFactoringData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalFactoringModel = this.getOwnerComponent().getModel("totalFactoringData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTotalFactoringData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_factor_totalSet", { // ✅ Total LC
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Total Factoring Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalFactoringData", "Total Factoring");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment13", oData.results, "idTotalFactoringChart");

						oTotalFactoringModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total Factoring Data:", oError);
						sap.m.MessageBox.error("Error fetching Total Factoring Data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalFactoringData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total Factoring Data.");
			}
		},

		/*********************** RXIL BACKEND CALL ***********************/

		getBackendDataPanel6: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedRXILTabKey; // You may want to rename this key if it's RXIL specific

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario14") this.getRXILData();
			else if (sSelectedTabKey === "scenario15") this.getTop10RXILData();
			else if (sSelectedTabKey === "scenario16") this.getTotalRXILData();
		},

		getRXILData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oRXILModel = this.getOwnerComponent().getModel("rxilData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getRXILData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_ven_rxilSet", { // ✅ All Vendor RXIL
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("RXIL Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("rxilData", "RXIL");
							return;
						}
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Rxil"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Rxil"]);

						oRXILModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment14", oData.results, "idRXILVizFrame");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error RXIL:", oError);
						sap.m.MessageBox.error("Error fetching RXIL data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getRXILData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching RXIL data.");
			}
		},

		getTop10RXILData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10RXILModel = this.getOwnerComponent().getModel("top10RXILData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTop10RXILData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_rxil_tenSet", { // ✅ Top 10 RXIL
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Top 10 RXIL Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10RXILData", "Top 10 RXIL");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Rxil"]);
						// Step 2️⃣: Add DisplayVendor field for unique dimension
						aCleanedData.forEach(d => {
							d.DisplayVendorKey = `${d.Name1}_${d.Lifnr}`; // unique, internal use
							d.DisplayVendor = d.Name1; // visible label only
						});

						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Rxil"]);

						oTop10RXILModel.setData(aConvertedData);
						that.applyDynamicColorsRXILTOP10("chartFragment15", oData.results, "idTop10RXILVizFrame");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10 RXIL):", oError);
						sap.m.MessageBox.error("Error fetching Top 10 RXIL data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10RXILData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 RXIL data.");
			}
		},

		getTotalRXILData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalRXILModel = this.getOwnerComponent().getModel("totalRXILData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTotalRXILData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}
				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();
				oModel.read("/es_rxil_totalSet", { // ✅ Total RXIL
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Total RXIL Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalRXILData", "Total RXIL");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment16", oData.results, "idTotalRXILChart");

						oTotalRXILModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total RXIL Data):", oError);
						sap.m.MessageBox.error("Error fetching Total RXIL Data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalRXILData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total RXIL Data.");
			}
		},

		/*********************** ABG BACKEND CALL ***********************/

		getBackendDataPanel7: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedABGTabKey; // ABG specific key

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario17") this.getABGData();
			else if (sSelectedTabKey === "scenario18") this.getTop10ABGData();
			else if (sSelectedTabKey === "scenario19") this.getTotalABGData();
		},

		getABGData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oABGModel = this.getOwnerComponent().getModel("abgData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getABGData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_ven_abgSet", { // ✅ All Vendor ABG
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ ABG Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("abgData", "ABG");
							return;
						}
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Abg"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Abg"]);

						oABGModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment17", oData.results, "idABGChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (ABG):", oError);
						sap.m.MessageBox.error("Error fetching ABG data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getABGData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching ABG data.");
			}
		},

		getTop10ABGData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10ABGModel = this.getOwnerComponent().getModel("top10ABGData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTop10ABGData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_abg_tenSet", { // ✅ Top 10 ABG
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Top 10 ABG Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10ABGData", "Top 10 ABG");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Abg"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Abg"]);

						oTop10ABGModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment18", oData.results, "idTop10ABGChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10 ABG):", oError);
						sap.m.MessageBox.error("Error fetching Top 10 ABG data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10ABGData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 ABG data.");
			}
		},

		getTotalABGData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalABGModel = this.getOwnerComponent().getModel("totalABGData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTotalABGData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_abg_totalSet", { // ✅ Total ABG
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Total ABG Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalABGData", "Total ABG");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment19", oData.results, "idTotalABGChart");

						oTotalABGModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total ABG):", oError);
						sap.m.MessageBox.error("Error fetching Total ABG data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalABGData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total ABG data.");
			}
		},

		/*********************** PBG BACKEND CALL ***********************/

		getBackendDataPanel8: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedPBGTabKey; // PBG specific key

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario20") this.getPBGData();
			else if (sSelectedTabKey === "scenario21") this.getTop10PBGData();
			else if (sSelectedTabKey === "scenario22") this.getTotalPBGData();
		},

		// All Vendor PBG
		getPBGData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oPBGModel = this.getOwnerComponent().getModel("pbgData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getPBGData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_ven_pbgSet", { // ✅ All Vendor PBG
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ PBG Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("pbgData", "PBG");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Pbg"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Pbg"]);

						oPBGModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment20", oData.results, "idPBGChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (PBG):", oError);
						sap.m.MessageBox.error("Error fetching PBG data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getPBGData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching PBG data.");
			}
		},

		// Top 10 PBG
		getTop10PBGData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTop10PBGModel = this.getOwnerComponent().getModel("top10PBGData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTop10PBGData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_pbg_tenSet", { // ✅ Top 10 PBG
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Top 10 PBG Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("top10PBGData", "Top 10 PBG");
							return;
						}

						var aCleanedData = that.normalizeMinusValues(oData.results, ["Pbg"]);
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Pbg"]);

						oTop10PBGModel.setData(aConvertedData);
						that.applyDynamicColorsVendorAdvance("chartFragment21", oData.results, "idTop10PBGChart");
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Top 10 PBG):", oError);
						sap.m.MessageBox.error("Error fetching Top 10 PBG data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTop10PBGData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Top 10 PBG data.");
			}
		},

		// Total PBG
		getTotalPBGData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_ADVANCE_SRV");
			var oTotalPBGModel = this.getOwnerComponent().getModel("totalPBGData"); // Make sure this model exists
			var that = this;

			console.log("🚀 getTotalPBGData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);
				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/es_pbg_totalSet", { // ✅ Total PBG
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Total PBG Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("totalPBGData", "Total PBG");
							return;
						}

						// ✅ Normalize minus values before formatting
						var aCleanedData = that.normalizeMinusValues(oData.results, ["Total"]);

						// ✅ Convert to lakhs after cleanup
						var aConvertedData = that.formatAmountsToLakhs(aCleanedData, ["Total"]);

						that.applyDynamicColorsVendorAdvanceTotal("chartFragment22", oData.results, "idTotalPBGChart");

						oTotalPBGModel.setData(aConvertedData);
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error (Total PBG):", oError);
						sap.m.MessageBox.error("Error fetching Total PBG data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getTotalPBGData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Total PBG data.");
			}
		},

		/*********************** Summary BACKEND CALL ***********************/
		getBackendDataPanelSummary: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var sSelectedTabKey = oGlobalData.selectedSummaryTabKey; // You may want to rename this key if it's RXIL specific

			if (!sSelectedTabKey) return; // no tab selected

			if (sSelectedTabKey === "scenario23") {
				this.getSummaryData();
			}
		},

		getSummaryData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oModel = this.getOwnerComponent().getModel("ZVENDOR_summary_SRV");
			var oSummaryModel = this.getOwnerComponent().getModel("summaryData");
			var that = this;

			console.log("🚀 getSummaryData started with:", oGlobalData);

			try {
				var aFilters = this._buildVendorAdvanceFilters(oGlobalData);

				if (!aFilters || aFilters.length === 0) {
					sap.m.MessageBox.warning("No filters applied. Please select at least one parameter.");
					return;
				}

				var oFinalFilter = new sap.ui.model.Filter(aFilters, true);

				sap.ui.core.BusyIndicator.show();

				oModel.read("/ZVEN_SUMMARYSet", {
					filters: [oFinalFilter],
					success: function(oData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("✅ Summary Data Loaded:", oData.results);
						if (!oData.results || oData.results.length === 0) {
							that._handleNoData("summaryData", "Summary");
							return;
						}

						if (oData.results && oData.results.length > 0) {
							// Prepare summary array for chart/table
							const oRaw = oData.results[0];
							const aSummary = that._prepareSummaryData(oRaw); // call helper

							console.log("📊 Prepared Summary Data:", aSummary);

							that.applyDynamicColorsVendorAdvanceSummary("chartFragmentSummary", aSummary, "idSummaryChart");

							oSummaryModel.setData(aSummary);
						} else {
							oSummaryModel.setData([]);
							sap.m.MessageToast.show("No summary data found for the selected filters.");
						}
					},
					error: function(oError) {
						sap.ui.core.BusyIndicator.hide();
						console.error("❌ OData Read Error:", oError);
						sap.m.MessageBox.error("Error fetching Summary data!");
					}
				});

			} catch (err) {
				sap.ui.core.BusyIndicator.hide();
				console.error("💥 Unexpected error in getSummaryData:", err);
				sap.m.MessageBox.error("An unexpected error occurred while fetching Summary data.");
			}
		},

		/*************** search value within fragment *****************/

		onSearchVenderMaster: function(oEvent) {
			var sQuery = oEvent.getParameter("newValue");

			// Get the correct fragment ID
			var sFragmentId = this.getView().getId() + "VenderMasterDialog";

			var oList = Fragment.byId(sFragmentId, "idVenderMasterList");
			if (!oList) return;

			var oBinding = oList.getBinding("items");
			if (!oBinding) return;

			var aFilters = [];
			if (sQuery) {
				var oFilter1 = new sap.ui.model.Filter("lifnr", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter2 = new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(new sap.ui.model.Filter({
					filters: [oFilter1, oFilter2],
					and: false
				}));
			}

			oBinding.filter(aFilters);
		},
		onSearchCompanyCodeMaster: function(oEvent) {
			var sQuery = oEvent.getParameter("newValue");

			// Get the correct fragment ID
			var sFragmentId = this.getView().getId() + "CompanyCodeMasterDialog";

			var oList = Fragment.byId(sFragmentId, "idCompanyCodeMasterList");
			if (!oList) return;

			var oBinding = oList.getBinding("items");
			if (!oBinding) return;

			var aFilters = [];
			if (sQuery) {
				var oFilter1 = new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter2 = new sap.ui.model.Filter("butxt", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(new sap.ui.model.Filter({
					filters: [oFilter1, oFilter2],
					and: false
				}));
			}

			oBinding.filter(aFilters);
		},

		/*************** set the each property to globalData & reflect data in input field & Date Picker *****************/

		onToggleSelectAll: function(oEvent) {
			var oButton = oEvent.getSource();
			var sFragmentId = this.getView().getId() + "VenderMasterDialog";
			var oList = Fragment.byId(sFragmentId, "idVenderMasterList");

			if (!oList) return;

			var bSelectAll = oButton.getText() === "Select All";
			oList.getItems().forEach(function(oItem) {
				oItem.setSelected(bSelectAll);
			});

			// Update button text
			oButton.setText(bSelectAll ? "Deselect All" : "Select All");

			// Update global model with new selections
			this._updateSelectedVenders(oList);
		},
		onSelectionChangeVenderMaster: function(oEvent) {
			var oList = oEvent.getSource();
			this._updateSelectedVenders(oList);
		},
		_updateSelectedVenders: function(oList) {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var aSelectedVenderIDs = oGlobalModel.getProperty("/selectedVenderIDs") || [];
			var aSelectedVenderNames = oGlobalModel.getProperty("/selectedVenderNames") || [];

			var aAllItems = oList.getItems();

			aAllItems.forEach(function(oItem) {
				var sID = oItem.getTitle();
				var sName = oItem.getDescription();

				if (oItem.getSelected()) {
					// Add if not already in the global selection
					if (!aSelectedVenderIDs.includes(sID)) {
						aSelectedVenderIDs.push(sID);
						aSelectedVenderNames.push(sName);
					}
				} else {
					// Remove if deselected
					var iIndex = aSelectedVenderIDs.indexOf(sID);
					if (iIndex !== -1) {
						aSelectedVenderIDs.splice(iIndex, 1);
						aSelectedVenderNames.splice(iIndex, 1);
					}
				}
			});

			// ✅ Update global model with merged selection
			// ✅ Update global model with merged selection
			oGlobalModel.setProperty("/selectedVenderIDs", aSelectedVenderIDs);
			oGlobalModel.setProperty("/selectedVenderNames", aSelectedVenderNames);
			oGlobalModel.setProperty("/selectedVenderNamesDisplay", aSelectedVenderIDs.join(", "));

			// 🔄 Update button state
			var sFragmentId = this.getView().getId() + "VenderMasterDialog";
			var oSelectAllBtn = Fragment.byId(sFragmentId, "idSelectAllBtn");

			if (oSelectAllBtn) {
				if (aAllItems.length > 0 && aAllItems.every(function(oItem) {
						return oItem.getSelected();
					})) {
					oSelectAllBtn.setText("Deselect All");
				} else {
					oSelectAllBtn.setText("Select All");
				}
			}
		},

		onConfirmVenderMaster: function() {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");

			var aSelectedNamesDisplay = oGlobalModel.getProperty("/selectedVenderNamesDisplay") || "";
			var aSelectedNames = oGlobalModel.getProperty("/selectedVenderNames") || [];
			var aSelectedIDs = oGlobalModel.getProperty("/selectedVenderIDs") || [];

			console.log("Confirmed selected IDs:", aSelectedIDs);
			console.log("Confirmed selected Names:", aSelectedNames);
			console.log("Confirmed selected Display Names:", aSelectedNamesDisplay);

			oGlobalModel.refresh(true);

			this._resetVenderMasterDialog();
			this._oVenderMasterDialog.close();
		},
		onCloseVenderMaster: function() {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			oGlobalModel.setProperty("/selectedVenderIDs", []);
			oGlobalModel.setProperty("/selectedVenderNames", []);
			oGlobalModel.setProperty("/selectedVenderNamesDisplay", "");

			this._resetVenderMasterDialog();
			this._oVenderMasterDialog.close();
		},
		_resetVenderMasterDialog: function() {
			var sFragmentId = this.getView().getId() + "VenderMasterDialog";
			var oList = Fragment.byId(sFragmentId, "idVenderMasterList");
			var oSearchField = Fragment.byId(sFragmentId, "idVenderSearchField");
			var oSelectAllBtn = Fragment.byId(sFragmentId, "idSelectAllBtn");

			// Clear Search
			if (oSearchField) {
				oSearchField.setValue("");
				this.onSearchVenderMaster({
					getParameter: function() {
						return "";
					}
				});
			}

			// Clear selections
			if (oList) {
				oList.getItems().forEach(function(oItem) {
					oItem.setSelected(false);
				});
			}

			// Reset button text
			if (oSelectAllBtn) {
				oSelectAllBtn.setText("Select All");
			}
		},

		onSelectionChangeCompanyCodeMaster: function(oEvent) {
			var oList = oEvent.getSource();
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var aSelectedCompanyCodeIDs = oGlobalModel.getProperty("/selectedCompanyCodeIDs") || [];
			var aSelectedCompanyCodeNames = oGlobalModel.getProperty("/selectedCompanyCodeNames") || [];

			var aAllItems = oList.getItems();
			aAllItems.forEach(function(oItem) {
				var sID = oItem.getTitle();
				var sName = oItem.getDescription();

				// If item is selected
				if (oItem.getSelected()) {
					if (!aSelectedCompanyCodeIDs.includes(sID)) {
						aSelectedCompanyCodeIDs.push(sID);
						aSelectedCompanyCodeNames.push(sName);
					}
				} else {
					// If item is unselected
					var index = aSelectedCompanyCodeIDs.indexOf(sID);
					if (index !== -1) {
						aSelectedCompanyCodeIDs.splice(index, 1);
						aSelectedCompanyCodeNames.splice(index, 1);
					}
				}
			});

			oGlobalModel.setProperty("/selectedCompanyCodeNames", aSelectedCompanyCodeNames);
			oGlobalModel.setProperty("/selectedCompanyCodeIDs", aSelectedCompanyCodeIDs);
			oGlobalModel.setProperty("/selectedCompanyCodeNamesDisplay", aSelectedCompanyCodeIDs.join(", "));
		},
		onConfirmCompanyCodeMaster: function() {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");

			// Values are already being maintained correctly in the model
			var aSelectedNamesDisplay = oGlobalModel.getProperty("/selectedCompanyCodeNamesDisplay") || "";
			var aSelectedNames = oGlobalModel.getProperty("/selectedCompanyCodeNames") || [];
			var aSelectedIDs = oGlobalModel.getProperty("/selectedCompanyCodeIDs") || [];

			// You can now directly use these for any processing or display
			console.log("Confirmed selected IDs:", aSelectedIDs);
			console.log("Confirmed selected Names:", aSelectedNames);
			console.log("Confirmed selected Display Names:", aSelectedNamesDisplay);

			oGlobalModel.refresh(true);

			this._resetCompanyCodeMasterDialog();
			this._oCompanyCodeMasterDialog.close();
		},
		onCloseCompanyCodeMaster: function() {
			// Clear global model selections
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			oGlobalModel.setProperty("/selectedCompanyCodeIDs", []);
			oGlobalModel.setProperty("/selectedCompanyCodeNames", []);
			oGlobalModel.setProperty("/selectedCompanyCodeNamesDisplay", "");

			this._resetCompanyCodeMasterDialog();
			this._oCompanyCodeMasterDialog.close();
		},
		_resetCompanyCodeMasterDialog: function() {
			// Get the correct fragment ID
			var sFragmentId = this.getView().getId() + "CompanyCodeMasterDialog";

			var oList = Fragment.byId(sFragmentId, "idCompanyCodeMasterList");
			var oSearchField = Fragment.byId(sFragmentId, "idCompanyCodeSearchField");

			// Clear Search
			if (oSearchField) {
				oSearchField.setValue("");

				// Manually trigger the liveChange event handler with empty value
				this.onSearchCompanyCodeMaster({
					getParameter: function() {
						return "";
					}
				});
			}

			// Clear selections
			if (oList) {
				oList.getItems().forEach(function(oItem) {
					oItem.setSelected(false);
				});
			}
		},

		/*************** Account Group Handling *****************/
		onToggleSelectAllAccountGroup: function(oEvent) {
			var oButton = oEvent.getSource();
			var sFragmentId = this.getView().getId() + "AccountGroupDialog";
			var oList = Fragment.byId(sFragmentId, "idAccountGroupList");

			if (!oList) return;

			var bSelectAll = oButton.getText() === "Select All";
			oList.getItems().forEach(function(oItem) {
				oItem.setSelected(bSelectAll);
			});

			oButton.setText(bSelectAll ? "Deselect All" : "Select All");

			this._updateSelectedAccountGroups(oList);
		},

		onSelectionChangeAccountGroup: function(oEvent) {
			var oList = oEvent.getSource();
			this._updateSelectedAccountGroups(oList);
		},

		_updateSelectedAccountGroups: function(oList) {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var aSelectedIDs = [];
			var aSelectedNames = [];

			oList.getItems().forEach(function(oItem) {
				if (oItem.getSelected()) {
					aSelectedIDs.push(oItem.getTitle());
					aSelectedNames.push(oItem.getDescription());
				}
			});

			oGlobalModel.setProperty("/selectedAccountGroupIDs", aSelectedIDs);
			oGlobalModel.setProperty("/selectedAccountGroupNames", aSelectedNames);
			oGlobalModel.setProperty("/selectedAccountGroupDisplay", aSelectedIDs.join(", "));

			var sFragmentId = this.getView().getId() + "AccountGroupDialog";
			var oSelectAllBtn = Fragment.byId(sFragmentId, "idSelectAllAccountGroupBtn");

			if (oSelectAllBtn) {
				if (oList.getItems().length > 0 && aSelectedIDs.length === oList.getItems().length) {
					oSelectAllBtn.setText("Deselect All");
				} else {
					oSelectAllBtn.setText("Select All");
				}
			}
		},

		onConfirmAccountGroup: function() {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var sDisplay = oGlobalModel.getProperty("/selectedAccountGroupDisplay") || "";

			// Reflect in input
			this.byId("_accountGroupId").setValue(sDisplay);

			console.log("Confirmed Account Groups:", oGlobalModel.getProperty("/selectedAccountGroupIDs"));
			console.log("Confirmed Names:", oGlobalModel.getProperty("/selectedAccountGroupNames"));
			console.log("Display:", sDisplay);

			oGlobalModel.refresh(true);
			this._resetAccountGroupDialog();
			this._oAccountGroupDialog.close();
		},

		onCloseAccountGroup: function() {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			oGlobalModel.setProperty("/selectedAccountGroupIDs", []);
			oGlobalModel.setProperty("/selectedAccountGroupNames", []);
			oGlobalModel.setProperty("/selectedAccountGroupDisplay", "");

			this._resetAccountGroupDialog();
			this._oAccountGroupDialog.close();
		},

		_resetAccountGroupDialog: function() {
			var sFragmentId = this.getView().getId() + "AccountGroupDialog";
			var oList = Fragment.byId(sFragmentId, "idAccountGroupList");
			var oSearchField = Fragment.byId(sFragmentId, "idAccountGroupSearchField");
			var oSelectAllBtn = Fragment.byId(sFragmentId, "idSelectAllAccountGroupBtn");

			if (oSearchField) {
				oSearchField.setValue("");
				this.onSearchAccountGroup({
					getParameter: function() {
						return "";
					}
				});
			}

			if (oList) {
				oList.getItems().forEach(function(oItem) {
					oItem.setSelected(false);
				});
			}

			if (oSelectAllBtn) {
				oSelectAllBtn.setText("Select All");
			}
		},

		onSearchAccountGroup: function(oEvent) {
			var sValue = oEvent.getParameter("newValue") || ""; // <-- Use "newValue" for liveChange
			var sFragmentId = this.getView().getId() + "AccountGroupDialog";
			var oList = Fragment.byId(sFragmentId, "idAccountGroupList");

			if (!oList) return;

			oList.getItems().forEach(function(oItem) {
				var sTitle = oItem.getTitle() || "";
				var sDesc = oItem.getDescription() || "";
				var bVisible = sTitle.toLowerCase().includes(sValue.toLowerCase()) ||
					sDesc.toLowerCase().includes(sValue.toLowerCase());
				oItem.setVisible(bVisible);
			});
		},

		onVenderDateChange: function(oEvent) {
			var oDatePicker = oEvent.getSource();
			var sValue = oEvent.getParameter("value"); // raw value from DatePicker
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");

			if (!sValue) {
				// If cleared, reset the model value
				oGlobalModel.setProperty("/selectedVenderDate", null);
				return;
			}
			this._resetCacheOnFilterChange();

			// Get Date object
			var oDate = oDatePicker.getDateValue();
			if (!oDate) {
				sap.m.MessageToast.show("Invalid date selected. Please try again.");
				oGlobalModel.setProperty("/selectedVenderDate", null);
				return;
			}

			// Format to yyyymmdd before setting
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});
			var sFormattedDate = oDateFormat.format(oDate);

			// Store formatted date in model
			oGlobalModel.setProperty("/selectedVenderDate", sFormattedDate);
		},

		/*************** get the Backend data for Vender  *****************/

		onSearchData: function() {
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();

		},

		getVendorHistoryBackendData: function() {
			var that = this;
			// Check Input Validation
			if (!this.validateInputs()) {
				return;
			}

			var oModel = this.getOwnerComponent().getModel();
			var oVendorHistoryModel = this.getOwnerComponent().getModel("venderHistoryData");
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();

			if (!oModel || !oVendorHistoryModel || !oGlobalData) {
				console.error("Required models are not available.");
				sap.m.MessageBox.error("Could not access required models for fetching vendor history data.");
				return;
			}

			var sCompanyCode = oGlobalData.selectedCompanyCodeIDs || [];
			var sVenderCode = oGlobalData.selectedVenderIDs || [];
			var sVenderDate = oGlobalData.selectedVenderDate;

			// Build filters
			var aFilters = this._buildVendorHistoryFilters(sCompanyCode, sVenderCode, sVenderDate);

			sap.ui.core.BusyIndicator.show();

			oModel.read("/es_vend_hstset", {
				filters: aFilters,
				success: function(oResponse) {
					sap.ui.core.BusyIndicator.hide();

					var aResults = (oResponse && oResponse.results) ? oResponse.results : [];

					// Optional sorting by lifnr
					if (aResults.length > 0 && aResults[0].lifnr) {
						aResults.sort(function(a, b) {
							return parseInt(a.lifnr, 10) - parseInt(b.lifnr, 10);
						});
					}

					// Convert values for each item
					aResults = aResults.map(function(item) {
						return that.convertValuesToLacs(item); // 👈 use the helper
					});

					oVendorHistoryModel.setData(aResults || []);
					console.log("Vendor history data loaded:", aResults);
				},
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
					console.error("Error fetching vendor history data:", oError);

					var sErrorMessage = "Failed to fetch vendor history data.";
					try {
						var oErrorObj = JSON.parse(oError.responseText);
						if (oErrorObj && oErrorObj.error && oErrorObj.error.message && oErrorObj.error.message.value) {
							sErrorMessage = oErrorObj.error.message.value;
						}
					} catch (e) {
						console.warn("Error parsing error response JSON:", e);
					}

					sap.m.MessageBox.error(sErrorMessage);
				}
			});
		},
		_buildVendorHistoryFilters: function(sCompanyCode, aVenderCodes, sVenderDate) {
			var aFilters = [];

			// Company Code filter
			if (sCompanyCode) {
				aFilters.push(new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, sCompanyCode));
			}

			// Vendor filter (multiple OR conditions)
			if (aVenderCodes && aVenderCodes.length > 0) {
				var aVendorFilters = aVenderCodes.map(function(sCode) {
					return new sap.ui.model.Filter("lifnr", sap.ui.model.FilterOperator.EQ, sCode);
				});

				// OR condition for vendors
				aFilters.push(new sap.ui.model.Filter({
					filters: aVendorFilters,
					and: false
				}));
			}

			// Date filter
			if (sVenderDate) {
				aFilters.push(new sap.ui.model.Filter("budat", sap.ui.model.FilterOperator.LE, sVenderDate));
			}

			return aFilters;
		},

		/*************** helper function  *****************/

		/**
		 * Normalize minus sign and convert numeric fields to proper Numbers.
		 * Example: "1,234-" → -1234, "567.89-" → -567.89
		 *
		 * @param {Array} aData - Array of objects from backend
		 * @param {Array} aFields - Field names to clean (e.g. ["Lc", "AdvanceAmt"])
		 * @returns {Array} Cleaned array with corrected numeric values
		 */
		normalizeMinusValues: function(aData, aFields) {
			if (!Array.isArray(aData) || aData.length === 0) {
				return aData;
			}

			return aData.map(function(oItem) {
				aFields.forEach(function(sField) {
					let vVal = oItem[sField];

					if (vVal !== undefined && vVal !== null) {
						// Convert to string for cleaning
						let sVal = String(vVal).trim();

						// Remove commas (e.g., "1,234-" → "1234-")
						sVal = sVal.replace(/,/g, "");

						// If value ends with minus, move it to the front
						if (/^-?\d+(\.\d+)?-$/.test(sVal) || /\d-\s*$/.test(sVal)) {
							sVal = "-" + sVal.replace("-", "");
						}

						// Convert to proper number
						let nVal = parseFloat(sVal);

						// Only update if it's a valid number
						if (!isNaN(nVal)) {
							oItem[sField] = nVal;
						}
					}
				});
				return oItem;
			});
		},

		/**
		 * Handles vendor-based OData result processing.
		 * Converts amounts to lakhs, aggregates by vendor, and cleans blank names.
		 * 
		 * @param {Array} aResults - Raw OData results array
		 * @param {Array} aAmountFields - List of amount fields to convert (e.g. ["Netwr", "Amount"])
		 * @param {string} sNameField - Vendor name field (e.g. "Name1")
		 * @returns {Object} { tableData, chartData }
		 * 
		 */

		_resetAllTabKeys: function() {
			const oGlobalModel = this.getView().getModel("globalData");
			const oDefaults = {
				selectedStillToBeDeliveredTabKey: "scenario1",
				selectedVendorAdvanceTabKey: "scenario2",
				selectedCreditorTabKey: "scenario5",
				selectedLCTabKey: "scenario8",
				selectedFactoringTabKey: "scenario11",
				selectedRXILTabKey: "scenario14",
				selectedABGTabKey: "scenario17",
				selectedPBGTabKey: "scenario20",
				selectedSummaryTabKey: "scenarioSummary"
			};
			Object.entries(oDefaults).forEach(([key, val]) => {
				oGlobalModel.setProperty("/" + key, val);
			});
		},

		_handleNoData: function(sModelName, sPanelTitle) {
			const oModel = this.getOwnerComponent().getModel(sModelName);
			if (oModel) {
				oModel.setData([]); // 🧹 clear data for that panel only
			}

			sap.m.MessageBox.information(`No ${sPanelTitle} data available for the selected filters.`);
			console.log(`ℹ️ Cleared model '${sModelName}' because no data was found.`);
		},

		_resetCacheOnFilterChange: function() {
			// Reset main panel cache
			if (this._panelLoadCache && typeof this._panelLoadCache === "object") {
				Object.keys(this._panelLoadCache).forEach(key => {
					this._panelLoadCache[key] = false;
				});
				console.log("♻️ Panel cache reset due to filter change");
			}

			// Reset tab-level cache (panel2, panel3, etc.)
			if (this._panelTabLoadCache && typeof this._panelTabLoadCache === "object") {
				Object.keys(this._panelTabLoadCache).forEach(panelKey => {
					Object.keys(this._panelTabLoadCache[panelKey]).forEach(tabKey => {
						this._panelTabLoadCache[panelKey][tabKey] = false;
					});
				});
				console.log("♻️ Tab cache reset due to filter change");
			}
		},

		_prepareSummaryData: function(oRawData) {
			const summaryFields = [{
				text: "AbgText",
				total: "AbgTotal"
			}, {
				text: "CreditorText",
				total: "CreditorTotal"
			}, {
				text: "FactoringText",
				total: "FactoringTotal"
			}, {
				text: "LcText",
				total: "LcTotal"
			}, {
				text: "PbgText",
				total: "PbgTotal"
			}, {
				text: "RxilText",
				total: "RxilTotal"
			}, {
				text: "VendAdvText",
				total: "VendAdvTot"
			}, {
				text: "StillText",
				total: "StillTotal"
			}];

			return summaryFields
				.map(f => {
					let rawValue = (oRawData[f.total] || "0").toString().trim();
					let numericValue = parseFloat(rawValue.replace(/,/g, ""));
					if (isNaN(numericValue)) numericValue = 0;

					// Convert to lakhs and round to 2 decimal places
					numericValue = Math.round((numericValue / 100000) * 100) / 100;

					return {
						reportType: oRawData[f.text] || "",
						amount: numericValue
					};
				})
				.filter(item => item.reportType && item.reportType.trim() !== ""); // remove blanks
		},

		sortByTurnOverDesc: function(aData) {
			return aData.sort(function(a, b) {
				return parseFloat(b.turnOver) - parseFloat(a.turnOver);
			});
		},
		convertValuesToLacs: function(item) {
			// Fields that need to be converted
			var aFieldsToConvert = [
				"netpr", "wrbtr", "netwr", "vend_adv",
				"creditor", "lc", "factoring", "rxil", "abg", "pbg"
			];

			aFieldsToConvert.forEach(function(field) {
				if (item[field] !== undefined && item[field] !== null && !isNaN(item[field])) {
					var lacValue = parseFloat(item[field]) / 100000; // Convert to Lacs
					item[field] = parseFloat(lacValue).toFixed(2); // Round to 2 decimals
				}
			});

			return item;
		},
		generateSupplierShort: function(item) {
			const words = item.supplier.split(" ");
			const abbreviation = words
				.filter(w => w.length > 2 && w[0] === w[0].toUpperCase())
				.map(w => w[0])
				.join("")
				.toUpperCase();

			/*item.supplierShort = abbreviation || item.supplier;*/
			item.supplierShort = item.supplier;
		},

		/*************** Clear data from all input fields,radio button & model make it default  *****************/

		_clearAllPanelModels: function() {
			const aModelNames = [
				"stillToDeliverData",
				"vendorAdvanceData",
				"top10VendorAdvanceData",
				"totalVendorAdvanceData",
				"creditorData",
				"factoringData",
				"lcData",
				"rxilData"
			];

			aModelNames.forEach(modelName => {
				const oModel = this.getView().getModel(modelName);
				if (oModel) {
					oModel.setData({}); // clear model completely
					oModel.refresh(true);
					console.log(`🧹 Cleared model: ${modelName}`);
				}
			});
		},

		clearListData: function() {
			const that = this;

			sap.m.MessageBox.confirm("Are you sure you want to clear all data?", {
				onClose: function(oAction) {
					if (oAction !== sap.m.MessageBox.Action.OK) return;

					console.log("🧹 Clearing all data...");

					try {
						// --- Step 1: Clear Input Fields ---
						const aInputIds = [
							"_companyCodeInputId",
							"_VenderInputId",
							"_accountGroupId",
							"_venderDatePickerId",
							"_reportTypeSelect"
						];

						aInputIds.forEach((sId) => {
							const oControl =
								that.byId(sId) ||
								sap.ui.getCore().byId(sId) ||
								sap.ui.core.Fragment.byId(that.getView().getId() + "AccountGroupDialog", sId);

							if (oControl) {
								if (typeof oControl.setValue === "function") oControl.setValue("");
								if (oControl.removeAllTokens) oControl.removeAllTokens();
								if (oControl.setSelectedKey) oControl.setSelectedKey("");
								if (oControl.setDateValue) oControl.setDateValue(null);
								oControl.setValueState("None");
								console.log("✅ Cleared input:", sId);
							} else {
								console.warn("⚠️ Control not found or invalid:", sId);
							}
						});

						// --- Step 2: Clear globalData properties ---
						const oGlobalDataModel = that.getOwnerComponent().getModel("globalData");
						if (oGlobalDataModel) {
							[
								"/selectedVenderNamesDisplay",
								"/selectedVenderNames",
								"/selectedVenderIDs",
								"/selectedCompanyCodeNamesDisplay",
								"/selectedCompanyCodeNames",
								"/selectedCompanyCodeIDs",
								"/selectedAccountGroupNames",
								"/selectedAccountGroupIDs",
								"/selectedReportType",
								"/selectedVenderDate"
							].forEach((path) => oGlobalDataModel.setProperty(path, ""));
							console.log("✅ Cleared globalData properties");
						}

						// --- Step 3: Reset all other JSON models ---
						const oModelsToClear = [
							"venderHistoryData",
							"venderMasterData",
							"companyCodeMasterData",
							"accountGroupData",
							"vendorAdvanceData",
							"totalVendorAdvanceData",
							"top10VendorAdvanceData",
							"creditorData",
							"totalCreditorData",
							"top10CreditorData",
							"lcData",
							"top10LCData",
							"totalLCData",
							"factoringData",
							"top10FactoringData",
							"totalFactoringData",
							"rxilData",
							"top10RXILData",
							"totalRXILData",
							"abgData",
							"top10ABGData",
							"totalABGData",
							"pbgData",
							"top10PBGData",
							"totalPBGData",
							"selectedPanelModel",
							"summaryData",
							"stillToDeliverData"
						];

						oModelsToClear.forEach((sModelName) => {
							const oModel = that.getOwnerComponent().getModel(sModelName);
							if (oModel) {
								oModel.setData({});
								console.log("✅ Cleared model:", sModelName);
							} else {
								console.warn("⚠️ Model not found:", sModelName);
							}
						});

						// --- Step 4: Reset internal panel cache dynamically ---
						if (that._panelLoadCache && typeof that._panelLoadCache === "object") {
							Object.keys(that._panelLoadCache).forEach(key => {
								that._panelLoadCache[key] = false;
							});
							console.log("✅ Reset all panel cache dynamically");
						} else {
							that._panelLoadCache = {};
							console.log("✅ Created fresh panel cache object");
						}

						// --- Step 5: Notify user ---
						sap.m.MessageToast.show("All filters and cached data cleared successfully!");
					} catch (err) {
						console.error("💥 Error while clearing data:", err);
						sap.m.MessageBox.error("An unexpected error occurred while clearing data.");
					}
				}
			});
		}

	});
});