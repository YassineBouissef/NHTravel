angular.module("MarmolistasElPilarApp").controller("AnomaliesCtrl", function ($scope, $http, $location, $q) {

    let d = new Date();
    let today = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    let now = ("0" + (d.getHours())).slice(-2) + ':' + ("0" + (d.getMinutes())).slice(-2);

    $scope.anomalies = [];

    $scope.myFilter = function (anomaly) {
        if(+$scope.anomalyStatus === 0)
            return true;
        else if (+$scope.anomalyStatus === 1)
            return anomaly.terminada;
        else if (+$scope.anomalyStatus === 2)
            return !anomaly.terminada;
    };

    $scope.saveAnomaly = function () {
        console.log("Adding new anomaly", $scope.newAnomaly);
        postAnomaly($scope.newAnomaly);
    };

    $scope.anomalyDone = function (i) {
        console.log("Marking anomaly as done", $scope.anomalies[i]);
        $scope.anomalies[i].terminada = true;
        updateAnomaly($scope.anomalies[i]);
    };

    $scope.generateWord = function (anomaly) {
        console.log('Generating anomaly', anomaly);
        /*
        JSZipUtils.getBinaryContent("/res/presupuesto.docx", function (error, content) {
                if (error) {
                    throw error
                }
                let zip = new JSZip(content);
                let doc = new Docxtemplater().loadZip(zip);
                let date = new Date(bill.fecha);
                let items = [];
                let bruto = 0;
                bill.items.forEach(item => {
                    items.push({
                        nombre: item.articulo.nombre || '',
                        unidades: item.unidades || '',
                        medidas: item.dimension && item.dimension.alto && item.dimension.ancho ?
                            item.dimension.alto + ' * ' + item.dimension.ancho : '',
                        cantidad: item.dimension && item.dimension.alto && item.dimension.ancho && item.unidades ?
                            ((item.dimension.alto * item.dimension.ancho) / 10000) * item.unidades : '',
                        precio: item.tarifa || '',
                        descuento: item.descuento || item.descuento >= 0 ? item.descuento : '',
                        total: round(item.total || '')
                    });
                    bruto += item.total ? item.total : 0;
                });
                doc.setData({
                    tipo: $scope.billTypeSelected,
                    codigo: bill.codigo,
                    fecha: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                    nombre: bill.cliente.nombre || '',
                    dni: bill.cliente.dni || '',
                    domicilio: bill.cliente.domicilio || '',
                    poblacion: bill.cliente.poblacion || '',
                    provincia: bill.cliente.provincia || '',
                    cp: bill.cliente.cp || '',
                    observaciones: bill.observaciones_publicas || '',
                    formadepago: $scope.formadepagos[bill.formadepago].nombre,
                    items: items,
                    bruto: round(bruto),
                    rec: round(bill.rec ? bruto * 1.21 * 0.052 : 0),
                    descuento: 0,
                    total: round(bill.rec && bill.iva ? bruto * 1.27292 : bill.iva ? bruto * 1.21 : bill.rec ? bruto * 1.052 : bruto)
                });

                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render()
                } catch (error) {
                    let e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    };
                    console.log(JSON.stringify({error: e}));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    throw error;
                }

                let out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                }); //Output the document using Data-URI
                saveAs(out, "Presupuesto.docx")
            }
        );
        */
    };

    function updateAnomaly(anomaly) {
        $http.put("/api/v1/anomalies/" + anomaly._id, anomaly)
            .then(function (response) {
                console.log('Anomaly updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating anomaly', error);
                alert("Ups! Ha ocurrido un error al marca la anomalía como lista, inténtalo de nuevo en unos minutos.");
            });
    }

    function clearForm() {
        $("input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    $scope.removeAnomaly = function (i) {
        console.log("Deleting anomaly", $scope.anomalies[i]);
        let r = confirm("¿Está seguro de eliminar esta anomalía?");
        if (r) {
            deleteAnomaly($scope.anomalies[i]);
        } else {
            console.log("Anomaly not deleted");
        }
    };

    function getAnomalies() {
        $http.get("/api/v1/anomalies")
            .then(function (response) {
                console.log('Anomalies retrieved');
                $scope.anomalies = response.data;
            }, function (error) {
                console.log('Error retrieving anomalies', error);
                alert("Ups! Ha ocurrido un error al recuperar las anomalías, inténtalo de nuevo en unos minutos.");
            });
    }

    function postAnomaly(anomaly) {
        $http.post("/api/v1/anomalies", anomaly)
            .then(function (response) {
                console.log('Anomaly added', response);
                refresh();
            }, function (error) {
                console.log('Error adding anomaly', error);
                alert("Ups! Ha ocurrido un error al añadir la anomalía, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteAnomaly(anomaly) {
        $http.delete("/api/v1/anomalies/" + anomaly._id)
            .then(function (response) {
                console.log('Anomaly deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating anomaly', error);
                alert("Ups! Ha ocurrido un error al eliminar la anomalía, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getAnomalies();
        clearForm();
        $scope.newAnomaly = {};
        $scope.newAnomaly.terminada = false;
        $scope.newAnomaly.fecha = today;
        $scope.newAnomaly.hora = now;
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Anomalies controller");
        getAnomalies();
        $scope.newAnomaly = {};
        $scope.newAnomaly.terminada = false;
        $scope.newAnomaly.fecha = today;
        $scope.newAnomaly.hora = now;
        $scope.anomalyStatus = 0;
    }

    init();
});