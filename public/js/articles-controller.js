angular.module("MarmolistasElPilarApp").controller("ArticlesCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.articulos = [];

    $scope.guardarArticulo = function () {
        if ($scope.accion === "Añadir") {
            console.log("Creando artículo", $scope.nuevoArticulo);
            $scope.articulos.push($scope.nuevoArticulo);
        } else if ($scope.accion === "Editar") {
            console.log("Guardando artículo", $scope.nuevoArticulo);
            $scope.articulos[index] = $scope.nuevoArticulo;
        }
        toggleFormulario();
        refresh();
    };

    function toggleFormulario() {
        $("form#addArticuloForm label").each(function () {
            $(this).toggleClass('active');
        });
        $("form#addArticuloForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function limpiarFormulario() {
        $("form#addArticuloForm label").each(function () {
            $(this).removeClass('active');
        });
        $("form#addArticuloForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }


    $scope.editarArticulo = function (i) {
        index = i;
        $scope.accion = "Editar";
        $scope.icono_accion = "edit";
        $scope.clase_boton = "btn-large waves-effect waves-light orange";
        $scope.nuevoArticulo = $scope.articulos[i];
        console.log("Editando articulo", $scope.nuevoArticulo);
        toggleFormulario();
    };

    function refresh() {
        console.log("Refreshing");
        limpiarFormulario();
        $scope.nuevoArticulo = {};
        $scope.accion = "Añadir";
        $scope.icono_accion = "add";
        $scope.clase_boton = "btn-large waves-effect waves-light green";
    }

    function postInput(input) {
        $http.post("/inputs", input)
            .then(function (response) {
                console.log('Event/EPL sent to Kafka: ', response);
            }, function (error) {
                console.log('Error sending Event/EPL to Kafka: ', error);
            });
    }

    function updateAlertList() {
        $http.get("/alerts")
            .then(function (response) {
                console.log('Alerts detected: ', response);
                $scope.alerts = response.data.reverse();
            }, function (error) {
                console.log('Error retrieving alerts: ', error);
            });
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Articles controller");
        $scope.nuevoArticulo = {};
        $scope.accion = "Añadir";
        $scope.icono_accion = "add";
        $scope.clase_boton = "btn-large waves-effect waves-light green";
    }

    init();
})
;