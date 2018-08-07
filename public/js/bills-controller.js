angular.module("MarmolistasElPilarApp").controller("BillsCtrl", function ($scope, $http, $location, $q) {
    let index;

    function refresh() {
        console.log("Refreshing");
        $scope.selectedItem = {};
    }

    $scope.refresh = function () {
        refresh();
    };

    $scope.addItem = function () {
        console.log("Adding article", $scope.newItem);
        $scope.newItem.articulo = $scope.selectedItem;
        $scope.newItem.cantidad = ($scope.newItem.dimension.alto * $scope.newItem.dimension.ancho) / 10000;
        $scope.newItem.precio = $scope.newItem.tarifa;
        $scope.newItem.total = ((($scope.newItem.dimension.alto * $scope.newItem.dimension.ancho) / 10000)
            * $scope.newItem.tarifa)
            * ((100 - $scope.newItem.descuento) / 100)
            * $scope.newItem.unidades;
        $scope.newItem.total = Math.round($scope.newItem.total * 100) / 100;
        $scope.items.push($scope.newItem);
        $('.modal').modal('close');
        toggleForm();
        $scope.newItem = {};
    };

    function toggleForm() {
        $("form#addItemForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    $scope.setSelectedItem = function (i) {
        console.log("Setting item", $scope.articles[i]);
        $scope.selectedItem = $scope.articles[i];
        $scope.newItem = {
            dimension: {
                alto: $scope.selectedItem.dimension.alto,
                ancho: $scope.selectedItem.dimension.ancho
            }
        };
        $('.modal').modal('open');
    };

    function getArticles() {
        $http.get("/api/v1/articles")
            .then(function (response) {
                console.log('Articles retrieved');
                $scope.articles = response.data;
            }, function (error) {
                console.log('Error retrieving articles', error);
                alert("Ups! Ha ocurrido un error al recuperar los artículos, inténtalo de nuevo en unos minutos.");
            });
    }

    function getClient(id) {
        /*id = "5g533fc815249c4010458d15";
        $http.get("/api/v1/clients/" + id)
            .then(function (response) {
                console.log('Client retrieved');
                $scope.client = response.data;
            }, function (error) {
                console.log('Error retrieving client', error);
                alert("Ups! Ha ocurrido un error al recuperar los datos del cliente, inténtalo de nuevo en unos minutos.");
            });*/
    }

    function init() {
        console.log("Starting Bills controller");
        $scope.selectedItem = {};
        $scope.articles = [];
        $scope.items = [];
        getArticles();
        let url = window.location.href;
        $scope.userId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.userId);
        getClient($scope.userId);
    }

    init();
});