angular.module("NHTravelApp").controller("ClientsViewCtrl", function ($scope, $http, $location, $q) {

    let d = new Date();
    let today = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();

    $scope.myFilter = function (bill) {
        let date = new Date(bill.fecha).getTime();
        let dateParts = $scope.fecha.inicio.split("/");
        let dateStart = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], 0, 0, 0);
        dateParts = $scope.fecha.fin.split("/");
        let dateEnd = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], 23, 59, 59);

        if (date >= dateStart.getTime() &&
            date <= dateEnd.getTime()) {
            if (+$scope.isPaid === 0)
                return bill.tipo === +$scope.billType;
            else if (+$scope.isPaid === 1)
                return bill.pagado;
            else if (+$scope.isPaid === 2)
                return !bill.pagado;
        } else
            return false;
    };

    

    $scope.getTotalUnpaid = function () {
        let total = 0;
        $scope.bills.forEach((bill) => {
            if (bill.tipo === +$scope.billType) {
                if (!bill.pagado)
                    total += bill.total;
            }
        });
        return round(total);
    };

    $scope.generateBill = function (bill) {
        console.log('Generating bill', bill);
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
                        nombre: item.casa.nombre || '',
                        codigo: item.casa.codigo || '',
                        precio: item.casa.precio || '',
                        dias: item.casa.dias || '',
                        total: round(item.total || '')
                    });
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
                    items: items,
                    pagado: round(bill.pagado),
                    total: round(bill.pagado)
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
    };

    $scope.createBill = function () {
        console.log('Redirect to bills');
        window.location.href = '/facturas/crear/' + $scope.client._id;
    };

    $scope.editBill = function (bill) {
        console.log('Redirect to edit bill');
        window.location.href = '/facturas/editar/' + bill._id;
    };



    function postCheck(check) {
        $http.post("/api/v1/checks", check)
            .then(function (response) {
                console.log('Check added', response);
                updateBill($scope.billToPay);
            }, function (error) {
                console.log('Error adding check', error);
                alert("Ups! Ha ocurrido un error al añadir el cheque/pagarés, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateBill(bill) {
        $http.put("/api/v1/bills/" + bill._id, bill)
            .then(function (response) {
                console.log('Bill updated', response);
                $('#payBill').modal('close');
                refresh();
            }, function (error) {
                console.log('Error updating bill', error);
                alert("Ups! Ha ocurrido un error al actualizar el documento, inténtalo de nuevo en unos minutos.");
            });
    }

    function getChecks() {
        $http.get("/api/v1/checks")
            .then(function (response) {
                console.log('Checks retrieved');
                $scope.newCheck.codigo = response.data.length > 0 ? response.data[response.data.length - 1].codigo + 1 : 1;
            }, function (error) {
                console.log('Error retrieving checks', error);
                alert("Ups! Ha ocurrido un error al recuperar los cheques y pagarés, inténtalo de nuevo en unos minutos.");
            });
    }

    function getClient(id) {
        $http.get("/api/v1/clients/" + id)
            .then(function (response) {
                console.log('Client retrieved', response.data[0]);
                $scope.client = response.data[0];
            }, function (error) {
                console.log('Error retrieving client', error);
                alert("Ups! Ha ocurrido un error al recuperar los datos del cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function getBills(id) {
        $http.get("/api/v1/bills/client/" + id)
            .then(function (response) {
                console.log('Bills retrieved');
                $scope.bills = response.data;
            }, function (error) {
                console.log('Error retrieving client', error);
                alert("Ups! Ha ocurrido un error al recuperar las facturas del cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    $scope.removeBill = function (bill) {
        console.log("Deleting bill", bill);
        let r = confirm("¿Está seguro de eliminar este " + $scope.billTypeSelected + "?");
        if (r) {
            deleteBill(bill);
        } else {
            console.log("Bill not deleted");
        }
    };

    function deleteBill(bill) {
        $http.delete("/api/v1/bills/" + bill._id)
            .then(function (response) {
                console.log('Bill deleted', response);
                refresh();
            }, function (error) {
                console.log('Error deleting bill', error);
                alert("Ups! Ha ocurrido un error al eliminar el documento, inténtalo de nuevo en unos minutos.");
            });
    }

    function round(amount) {
        return Math.round(amount * 100) / 100;
    }

    function refresh() {
        console.log("Refreshing");
        $scope.newCheck = {};
        $scope.newCheck.fecha = today;
        $scope.newCheck.fecha_vencimiento = today;
        getChecks();
        getBills($scope.clientId);
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Clients View controller");
        $scope.newCheck = {};
        $scope.newCheck.fecha = today;
        $scope.newCheck.fecha_vencimiento = today;
        getChecks();
        $scope.client = {};
        $scope.bills = [];
        $scope.fecha = {
            inicio: '01/01/2018',
            fin: today
        };
        let url = window.location.href;
        $scope.clientId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.clientId);
        getClient($scope.clientId);
        getBills($scope.clientId);
    }

    init();

});