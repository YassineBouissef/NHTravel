angular.module("MarmolistasElPilarApp").controller("BillsCtrl", function ($scope, $http, $location, $q) {
    let index;
    $scope.groups = [];
    $scope.tarifas = [
        {
            id: 0,
            nombre: 'Tarifa General'
        },
        {
            id: 1,
            nombre: 'Tarifa Encimera'
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
        setTimeout(function () {
            $('#tarifa').find('option[value="' + $scope.selectedItem.tarifas[$scope.client.tarifa].valor + '"]').prop('selected', true);
            $('#tarifa').formSelect();
        }, 500);
        $scope.newItem = {
            tarifa: $scope.selectedItem.tarifas[$scope.client.tarifa].valor,
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
        $scope.client = {
            "nombre": "David Corral",
            "dni": "87548747Q",
            "domicilio": "Real 249",
            "poblacion": "Cádiz",
            "provincia": "Cádiz",
            "cp": 11100,
            "contacto": "Pepe",
            "email": "david@uca.es",
            "telefono": 666444333,
            "rec": 0,
            "formadepago": 0,
            "tarifa": 0
        };
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

    function getGroups() {
        $http.get("/api/v1/groups")
            .then(function (response) {
                console.log('Groups retrieved');
                $scope.groups = response.data;
            }, function (error) {
                console.log('Error retrieving groups', error);
                alert("Ups! Ha ocurrido un error al recuperar los grupos, inténtalo de nuevo en unos minutos.");
            });
    }

    function init() {
        console.log("Starting Bills controller");
        $scope.selectedItem = {};
        $scope.articles = [];
        $scope.items = [];
        getArticles();
        getGroups();
        let url = window.location.href;
        $scope.userId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.userId);
        getClient($scope.userId);
    }

    init();
});