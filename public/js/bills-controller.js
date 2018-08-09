angular.module("MarmolistasElPilarApp").controller("BillsCtrl", function ($scope, $http, $location, $q) {

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

    function round(amount) {
        return Math.round(amount * 100) / 100;
    }

    $scope.addItem = function () {
        console.log("Adding article", $scope.newItem);
        $scope.newItem.articulo = $scope.selectedItem;
        if (!$scope.newItem.descuento)
            $scope.newItem.descuento = 0;
        if ($scope.selectedItem.unidad.toUpperCase() === 'M2') {
            $scope.newItem.cantidad = ($scope.newItem.dimension.alto * $scope.newItem.dimension.ancho) / 10000;
            $scope.newItem.cantidad = round($scope.newItem.cantidad);
            $scope.newItem.total = ((($scope.newItem.dimension.alto * $scope.newItem.dimension.ancho) / 10000)
                * $scope.newItem.tarifa)
                * ((100 - $scope.newItem.descuento) / 100)
                * $scope.newItem.unidades;
            $scope.newItem.total = round($scope.newItem.total);
        } else {
            $scope.newItem.total = $scope.newItem.tarifa * $scope.newItem.unidades
                * ((100 - $scope.newItem.descuento) / 100);
            $scope.newItem.total = Math.round($scope.newItem.total * 100) / 100;
        }
        toggleForm();
        $scope.items.push($scope.newItem);
        $('.modal').modal('close');
        $scope.newItem = {};
    };


    $scope.addCustomItem = function () {
        console.log("Adding custom item", $scope.newCustomItem);
        if ($scope.newCustomItem) {
            $scope.items.push($scope.newCustomItem);
            $scope.newCustomItem = {};
        } else {
            alert("Ups! Escribe algún texto para añadirlo.");
        }
    };

    function toggleForm() {
        $("form#addItemForm :input").each(function () {
            $(this).removeClass('valid').removeClass('invalid');
        });
    }

    $scope.setSelectedItem = function (i) {
        console.log("Setting item", $scope.articles[i]);
        $scope.selectedItem = $scope.articles[i];
        setTimeout(function () {
            $('select#tarifa').prop('selectedIndex', $scope.client.tarifa + 1);
            $('#tarifa').formSelect();
        }, 500);
        $scope.newItem.tarifa = $scope.selectedItem.tarifas[$scope.client.tarifa].valor;
        if ($scope.selectedItem.unidad.toUpperCase() === "M2") {
            $scope.newItem.dimension = {
                alto: $scope.selectedItem.dimension.alto,
                ancho: $scope.selectedItem.dimension.ancho
            };
        }
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

    $scope.removeItem = function (i) {
        console.log("Deleting item", $scope.items[i]);
        let r = confirm("¿Está seguro de eliminar este artículo de la lista?\n" +
            "Codigo: " + $scope.items[i].articulo.codigo + " | Nombre: " + $scope.items[i].articulo.nombre);
        if (r) {
            $scope.items.splice(i, 1);
        } else {
            console.log("Item not deleted");
        }
    };

    $scope.filterArticle = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_codigo) return true;
        else if ($scope.filter_nombre && $scope.filter_codigo) {
            // Filtrar por codigo y nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.codigo.toLowerCase();
            let searchCode = $scope.filter_codigo.toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_codigo) {
            // Filtrar por código
            let code = item.codigo.toLowerCase();
            let search = $scope.filter_codigo.toLowerCase();
            return code.indexOf(search) > -1;
        }
    };

    $scope.saveDocument = function (type) {
        if (type === 0) {
            //Albarán
            $scope.bill.items = $scope.items;
            console.log($scope.bill);
        }
    };

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

    $scope.getTotal = function (aux) {
        let total = 0;
        $scope.items.forEach((item) => {
            if (item.hasOwnProperty("total"))
                total += item.total;
        });
        return round(total * aux);
    };

    function init() {
        console.log("Starting Bills controller");
        $scope.selectedItem = {};
        $scope.articles = [];
        $scope.items = [];
        $scope.bill = {};
        $scope.newItem = {};
        getArticles();
        getGroups();
        let url = window.location.href;
        $scope.userId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.userId);
        getClient($scope.userId);
    }

    init();
});