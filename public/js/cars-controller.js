angular.module("NHTravelApp").controller("CarCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.cars = [];

    $scope.saveCar = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating home", $scope.newCar);
            postCar($scope.newCar);
        } else if ($scope.action === "Editar") {
            console.log("Updating car", $scope.newCar);
            updateCar($scope.newCar);
        }
        toggleForm();
    };


    function toggleForm() {
        $("form#addCocheForm:input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addCocheForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    function clearFilter() {
        $scope.filter_nombre = "";
        $scope.filter_matricula = "";
        $("#search_code").removeClass('valid');
        $("#search_name").removeClass('valid');
        $("#label_code").removeClass('active');
        $("#label_name").removeClass('active');
    }

    $scope.editCar = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newCar = $scope.cars[i];
        console.log("Editing Car", $scope.newCar);
        toggleForm();
    };

    $scope.removeCar = function (i) {
        console.log("Deleting car", $scope.cars[i]);
        let r = confirm("¿Está seguro de eliminar este coche?\n" +
            "Matrícula: " + $scope.cars[i].matricula + " | Nombre: " + $scope.cars[i].nombre);
        if (r) {
            deleteCar($scope.cars[i]);
        } else {
            console.log("Cars not deleted");
        }
    };

    $scope.filterCar = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_matricula) return true;
        else if ($scope.filter_nombre && $scope.filter_matricula) {
            // Filtrar por codigo y nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.matricula.toString().toLowerCase();
            let searchCode = $scope.filter_matricula.toString().toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_matricula) {
            // Filtrar por matricula
            let code = item.matricula.toString().toLowerCase();
            let search = $scope.filter_matricula.toString().toLowerCase();
            return code.indexOf(search) > -1;
        }
    };

    function getCars() {
        $http.get("/api/v1/cars")
            .then(function (response) {
                console.log('Car retrieved');
                $scope.cars = response.data;
                //$scope.newHome.codigo = $scope.houses.length > 0 ? $scope.houses[$scope.houses.length - 1].codigo + 1 : 1;
            }, function (error) {
                console.log('Error retrieving Cars', error);
                alert("Ups! Ha ocurrido un error al recuperar los coches, inténtalo de nuevo en unos minutos.");
            });
    }

    function postCar(car) {
        $http.post("/api/v1/cars", car)
            .then(function (response) {
                console.log('Car added', response);
                refresh();
            }, function (error) {
                console.log('Error adding car', error);
                alert("Ups! Ha ocurrido un error al añadir el coche, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateCar(car) {
        $http.put("/api/v1/cars/" + car._id, car)
            .then(function (response) {
                console.log('Car updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating car', error);
                alert("Ups! Ha ocurrido un error al editar el coche, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteCar(car) {
        $http.delete("/api/v1/cars/" + car._id)
            .then(function (response) {
                console.log('Car deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating car', error);
                alert("Ups! Ha ocurrido un error al eliminar el coche, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getCars();
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
        console.log("Starting Cars controller");
        getCars();
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});