angular.module("MarmolistasElPilarApp").controller("ProvidersViewCtrl", function ($scope, $http, $location, $q) {

    let d = new Date();
    let today = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();

    $scope.providers = [];
    $scope.bills = [];
    $scope.deliverys = [];

    $scope.myFilter = function (provider) {
        if (+$scope.providerStatus === 0)
            return true;
        else if (+$scope.providerStatus === 1)
            return provider.factura;
        else if (+$scope.providerStatus === 2)
            return !provider.albaran;
    };

    $scope.editBill = function (bill) {
        //imagina que recibes por parametro la factura/albaran a editar, ahora hayq eu asignarla
        $scope.newBill = bill;
        //y debido a que tenemos un select, hay que hacer un truquito
        $('#tipo').find('option[value="'+bill.tipo+'"]').prop('selected', true);
        $('select').formSelect();
    };

    function getProvider(id) {
        $http.get("/api/v1/providers/" + id)
            .then(function (response) {
                console.log('Provider retrieved');
                $scope.provider = response.data[0];
            }, function (error) {
                console.log('Error retrieving providers', error);
                alert("Ups! Ha ocurrido un error al recuperar los datos del proveedores, inténtalo de nuevo en unos minutos.");
            });
    }


    function updateProvider(provider) {
        $http.put("/api/v1/providers/" + provider._id, provider)
            .then(function (response) {
                console.log('Provider updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating provider', error);
                alert("Ups! Ha ocurrido un error al editar el proveedor, inténtalo de nuevo en unos minutos.");
            });
    }

    $scope.saveBill = function () {
        $scope.newBill.tipo = +$scope.newBill.tipo;
        if (!$scope.provider.hasOwnProperty('bills'))
           $scope.provider.bills = [];
        $scope.provider.bills.push($scope.newBill);
        console.log("Updating provider", $scope.provider);
        updateProvider($scope.provider);
    };

    function refresh() {
        console.log("Refreshing");
        getProvider($scope.providerId);
        $scope.newBill = {};
        $scope.newBill.fecha = today;
        $scope.newBill.tipo = 0;
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Providers View controller");
        let url = window.location.href;
        $scope.providerId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.providerId);
        getProvider($scope.bills);
        $scope.newBill = {};
        $scope.newBill.fecha = today;
        $scope.newBill.tipo = 0;
    }

    init();

});