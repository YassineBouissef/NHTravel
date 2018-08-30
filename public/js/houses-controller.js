angular.module("NHTravelApp").controller("HomeCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.houses = [];

    $scope.saveHome = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating home", $scope.newHome);
            postHome($scope.newHome);
        } else if ($scope.action === "Editar") {
            console.log("Updating home", $scope.newHome);
            updateHome($scope.newHome);
        }
        toggleForm();
    };


    function toggleForm() {
        $("form#addCasaForm:input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addCasaForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    function clearFilter() {
        $scope.filter_nombre = "";
        $scope.filter_codigo = "";
        $("#search_code").removeClass('valid');
        $("#search_name").removeClass('valid');
        $("#label_code").removeClass('active');
        $("#label_name").removeClass('active');
    }

    $scope.editHome = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newHome = $scope.houses[i];
        console.log("Editing Home", $scope.newHome);
        toggleForm();
    };

    $scope.removeHome = function (i) {
        console.log("Deleting home", $scope.houses[i]);
        let r = confirm("¿Está seguro de eliminar esta casa?\n" +
            "Codigo: " + $scope.houses[i].codigo + " | Nombre: " + $scope.houses[i].nombre);
        if (r) {
            deleteHome($scope.houses[i]);
        } else {
            console.log("Houses not deleted");
        }
    };

    $scope.filterHome = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_codigo) return true;
        else if ($scope.filter_nombre && $scope.filter_codigo) {
            // Filtrar por codigo y nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.codigo.toString().toLowerCase();
            let searchCode = $scope.filter_codigo.toString().toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_codigo) {
            // Filtrar por código
            let code = item.codigo.toString().toLowerCase();
            let search = $scope.filter_codigo.toString().toLowerCase();
            return code.indexOf(search) > -1;
        }
    };

    function getHouses() {
        $http.get("/api/v1/houses")
            .then(function (response) {
                console.log('Home retrieved');
                $scope.houses = response.data;
                //$scope.newHome.codigo = $scope.houses.length > 0 ? $scope.houses[$scope.houses.length - 1].codigo + 1 : 1;
            }, function (error) {
                console.log('Error retrieving houses', error);
                alert("Ups! Ha ocurrido un error al recuperar las casas, inténtalo de nuevo en unos minutos.");
            });
    }

    function postHome(home) {
        $http.post("/api/v1/houses", home)
            .then(function (response) {
                console.log('Home added', response);
                refresh();
            }, function (error) {
                console.log('Error adding home', error);
                alert("Ups! Ha ocurrido un error al añadir la casa, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateHome(home) {
        $http.put("/api/v1/houses/" + home._id, home)
            .then(function (response) {
                console.log('Home updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating home', error);
                alert("Ups! Ha ocurrido un error al editar la casa, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteHome(home) {
        $http.delete("/api/v1/houses/" + home._id)
            .then(function (response) {
                console.log('Home deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating house', error);
                alert("Ups! Ha ocurrido un error al eliminar la casa, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getHouses();
        clearForm();
        clearFilter();
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };


    function init() {
        console.log("Starting Houses controller");
        getHouses();
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});