angular.module("MarmolistasElPilarApp").controller("ClientsViewCtrl", function ($scope, $http, $location, $q) {

    $scope.formadepagos = [
        {
            _id: 0,
            nombre: "50/50",
            selected: true
        },
        {
            _id: 1,
            nombre: "Tarjeta"
        },
        {
            _id: 2,
            nombre: "Efectivo"
        },
        {
            _id: 3,
            nombre: "Cheque"
        },
        {
            _id: 4,
            nombre: "30 días"
        },
        {
            _id: 5,
            nombre: "60 días"
        },
        {
            _id: 6,
            nombre: "Pagaré"
        },
        {
            _id: 7,
            nombre: "Confirming"
        }];
    $scope.tarifas = [
        {
            id: 0,
            nombre: 'Tarifa General'
        },
        {
            id: 1,
            nombre: 'Tarifa Encimera (35%)'
        },
        {
            id: 2,
            nombre: 'Tarifa Contratista'
        },
        {
            id: 3,
            nombre: 'Tarifa Público'
        }
    ];

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

    $scope.markBillAsPaid = function () {
        console.log('Marking bill as paid');

        console.log('Payment type: ', $scope.billPaymentType);
        console.log('Bill: ', $scope.billToPay);
        console.log('Cheque/Pagaré: ', $scope.check);

        $scope.billToPay.pagado = true;
        $scope.billToPay.metododepago = +$scope.billPaymentType;

        if (+$scope.billPaymentType < 2 || +$scope.billPaymentType > 3) {
            //Marcar como pagado simple
            alert("Marcar como pagado simple");
            updateBill($scope.billToPay);
        } else {
            //Crear cheque/pagaré
            alert("Marcar como pagado con cheque/pagaré, crear cheque/pagaré y actualizar la bill");
            updateBill($scope.billToPay);
        }
    };

    $scope.getPaymentType = function (bill) {
        if (bill.pagado) {
            switch (bill.metododepago) {
                case 0:
                    return 'Efectivo';
                case 1:
                    return 'Transferencia';
                case 2:
                    return 'Cheque nº XXXX';
                case 3:
                    return 'Pagarés nº XXXX';
                case 4:
                    return 'Confirming';
            }
        }
        else {
            return 'No pagado'
        }
    };

    $scope.payBill = function (bill) {
        console.log('Paying bill', bill);
        $('#payBill').modal('open');
        $scope.billToPay = bill;
    };

    $scope.unpayBill = function (bill) {
        console.log("Unpaying bill", bill);
        let r = confirm("¿Está seguro de marcar este A/P/F/FP como no pagado?");
        if (r) {
            bill.pagado = false;
            delete bill.metododepago;
            bill.check = {};
            updateBill(bill);
        } else {
            console.log("Bill not marked as unpaid");
        }
    };

    $scope.createBill = function () {
        console.log('Redirect to bills');
        window.location.href = '/facturas/crear/' + $scope.client._id;
    };

    $scope.editBill = function (bill) {
        console.log('Redirect to edit bill');
        window.location.href = '/facturas/editar/' + bill._id;
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

    function round(amount) {
        return Math.round(amount * 100) / 100;
    }

    $scope.updateBillType = function () {
        let type = $scope.billType;
        switch (+type) {
            case 0:
                $scope.billSelected = "Albarán";
                break;
            case 1:
                $scope.billSelected = "Presupuesto";
                break;
            case 2:
                $scope.billSelected = "Factura";
                break;
            case 3:
                $scope.billSelected = "Factura P.";
                break;
        }
    };

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
                alert("Ups! Ha ocurrido un error al recuperar los datos del cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    $scope.removeBill = function (bill) {
        console.log("Deleting bill", bill);
        let r = confirm("¿Está seguro de eliminar este A/P/F/FP?");
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

    function refresh() {
        console.log("Refreshing");
        let d = new Date();
        $scope.billPaymentType = 0;
        $scope.check = {};
        $scope.check.fecha = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.check.fecha_vencimiento = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        getBills($scope.clientId);
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Clients View controller");
        let d = new Date();
        $scope.billSelected = "Albarán";
        $scope.billType = 0;
        $scope.isPaid = 0;
        $scope.billPaymentType = 0;
        $scope.check = {};
        $scope.check.fecha = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.check.fecha_vencimiento = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.client = {};
        $scope.bills = [];
        $scope.fecha = {
            inicio: '01/01/2018',
            fin: ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear()
        };
        let url = window.location.href;
        $scope.clientId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.clientId);
        getClient($scope.clientId);
        getBills($scope.clientId);
    }

    init();

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
                    codigo: 100,
                    fecha: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                    nombre: bill.cliente.nombre,
                    dni: bill.cliente.dni,
                    domicilio: bill.cliente.domicilio,
                    poblacion: bill.cliente.poblacion,
                    provincia: bill.cliente.provincia,
                    cp: bill.cliente.cp,
                    observaciones: bill.observaciones_publicas,
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
    };
});