sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	var handle = "",
		frequency = 1000;

	return Controller.extend("fd.WebServices.controller.View1", {
		onInit: function () {
			var that = this;
			// that.getIOTData();
			that.createGraph();
			that.interval(that);

		},

		interval: function (_this) {
			handle = setInterval(function () {
					_this.loadData(_this);
				},
				frequency);
		},
		loadData: function (_this) {
			var oVizFrame = _this.getView().byId("graph1");
			// var data = _this.InputMdl.getData();
			var data = true;
			// if (data.AutoRefersh) {
			if (data) {
				// _this.getIOTData();
				// oVizFrame.setDataset(oDataset);
				// _this.createGraph();
				// _this.kpiBinding();
				_this.updateBindings();

			}

		},
		// getIOTData: function () {
		// 	var _this = this;
		// 	var url = "https://capgemini-service.eu10.cp.iot.sap/iot/core/api/v1/devices/135/measures?orderby=timestamp%20desc&skip=0&top=20";
		// 	var credentials = "root:XjCg2TL5l9fPwzI";
		// 	$.ajax({
		// 		type: "GET",
		// 		url: url,
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader("Authorization", "Basic " + btoa(credentials));
		// 		},
		// 		success: function (data) {
		// 			// var revdata = [];
		// 			// for(var i= data.length-1 ; i >= 0; i--)
		// 			// {
		// 			// 	revdata.push(data[i]);
		// 			// }
		// 			var oModel = new JSONModel(data);
		// 			_this.getView().setModel(oModel);
		// 		},
		// 		error: function (jqXHR, textStatus, errorThrown) {
		// 			alert(textStatus);
		// 		}
		// 	});
		// },
		updateBindings: function () {
			var _this = this;
			var oVizFrame = _this.getView().byId("graph1");
			var url = "https://capgemini-service.eu10.cp.iot.sap/iot/core/api/v1/devices/135/measures?orderby=timestamp%20desc&skip=0&top=20";
			var credentials = "root:XjCg2TL5l9fPwzI";
			$.ajax({
				type: "GET",
				url: url,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa(credentials));
				},
				success: function (data) {
					_this.chartData = new Array();

					oVizFrame.setBusy(false);
					var oModel = new JSONModel(data);
					_this.getView().setModel(oModel);
					for (var i = 0; i < data.length; i++) {
						var ts = _this.formatTimeStamp(data[i].timestamp);
						var lastMeasure = {
							"measure": {
								"DeviceData_MeasuredValues": data[i].measure.DeviceData_MeasuredValues
							},
							"timestamp": ts
						};
						//	 Measures.push("DeviceData_MeasuredValues" : data[i].measure.DeviceData_MeasuredValues) 
						_this.chartData.push(lastMeasure);

					}
					// oVizFrame.setDataset(_this.chartData);
					//	oVizFrame.setModel.setSizeLimit(_this.chartData.length);
					oVizFrame.getModel().setData(_this.chartData);
					_this.chartData = new Array();

				},

				error: function (jqXHR, textStatus, errorThrown) {
					alert(textStatus);
				}
			});

		},
		createGraph: function () {
			var _this = this;
			var oVizFrame = _this.getView().byId("graph1");
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Dates',
					value: {
						path: "timestamp",
						// type: new sap.ui.model.type.DateTime({
						// 	pattern: "MM/dd/yyyy HH:mm:ss"
						// })
					}
				}],
				measures: [{
					name: 'Value',
					value: {
						path: "measure/DeviceData_MeasuredValues"
					}
				}],

				data: {
					path: "/"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setVizType('line');

			//Properties
			oVizFrame.setVizProperties({
				plotArea: {

					referenceLine: {

						line: {

							primaryValues: [{

									value: 40,

									color: "#0000FF",

									type: "line",

									label: {

										text: "Min Value",

									}

								},

								{

									value: 80,

									color: "#FF0000",

									type: "line",

									label: {

										text: "Max Value",

									},

								}
							]

						}

					}

				},
				yAxis: {

					scale: {

						fixedRange: true,

						minValue: 10,

						maxValue: 100

					}

				},
				title: {
					visible: "true",
					text: "VizFrame IOT 4.0 Chart"
				}
			});

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "valueAxis",
					'type': "Measure",
					'values': ["Value"]
				}),
				feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "categoryAxis",
					'type': "Dimension",
					'values': ["Dates"]
				});
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis);

		},
		formatTimeStamp: function (time) {

			var date = new Date(time);

			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var Timestamp = month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

			return (Timestamp);
		},
		onExit: function () {

			window.clearInterval(handle); // Clearing Set Interval function on Exit
			// window.clearInterval();
		},

	});
});