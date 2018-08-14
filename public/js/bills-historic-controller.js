angular.module("MarmolistasElPilarApp").controller("BillsHistoricCtrl", function ($scope, $http, $location, $q) {

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
        } else {
            return 'No pagado'
        }
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

    $scope.updateBillTypeFilter = function () {
        switch (+$scope.billType) {
            case 0:
                $scope.billTypeSelected = "Albarán";
                break;
            case 1:
                $scope.billTypeSelected = "Presupuesto";
                break;
            case 2:
                $scope.billTypeSelected = "Factura";
                break;
            case 3:
                $scope.billTypeSelected = "Factura P.";
                break;
        }
    };

    function getBills() {
        $http.get("/api/v1/bills")
            .then(function (response) {
                console.log('Bills retrieved');
                $scope.bills = response.data;
            }, function (error) {
                console.log('Error retrieving client', error);
                alert("Ups! Ha ocurrido un error al recuperar las facturas, inténtalo de nuevo en unos minutos.");
            });
    }

    function round(amount) {
        return Math.round(amount * 100) / 100;
    }

    function init() {
        console.log("Starting Bills Historic controller");
        $scope.billTypeSelected = "Albarán";
        $scope.billType = 0;
        $scope.isPaid = 0;
        $scope.bills = [];
        $scope.fecha = {
            inicio: '01/01/2018',
            fin: today
        };
        getBills();
    }

    init();

});