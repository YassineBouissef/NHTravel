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

    $scope.createBill = function () {
        console.log('Redirect to bills');
        window.location.href = '/facturas/' + $scope.client._id;
    };

    $scope.updateBillType = function () {
        console.log($scope.billType);
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

    function init() {
        console.log("Starting Clients View controller");
        $scope.billSelected = "Albarán";
        $scope.client = {};
        $scope.bills = [];
        let url = window.location.href;
        $scope.clientId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.clientId);
        getClient($scope.clientId);
        getBills($scope.clientId);
    }

    init();
});