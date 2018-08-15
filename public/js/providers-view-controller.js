angular.module("MarmolistasElPilarApp").controller("ProvidersViewCtrl", function ($scope, $http, $location, $q) {

    let d = new Date();
    let today = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();

    $scope.myFilter = function (anomaly) {
        if (+$scope.anomalyStatus === 0)
            return true;
        else if (+$scope.anomalyStatus === 1)
            return anomaly.terminada;
        else if (+$scope.anomalyStatus === 2)
            return !anomaly.terminada;
    };

    function getProvider(id) {
        $http.get("/api/v1/providers/" + id)
            .then(function (response) {
                console.log('Provider retrieved');
                $scope.provider = response.data;
            }, function (error) {
                console.log('Error retrieving providers', error);
                alert("Ups! Ha ocurrido un error al recuperar los datos del proveedores, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getProvider($scope.providerId);
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Providers View controller");
        let url = window.location.href;
        $scope.providerId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.providerId);
        getProvider($scope.providerId);
    }

    init();

});