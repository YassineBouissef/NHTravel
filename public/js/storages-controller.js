angular.module("MarmolistasElPilarApp").controller("StoragesCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.storages = [];

    $scope.saveStorage = function () {
        console.log("Adding new storage", $scope.newStorage);
        $scope.storages.push($scope.newStorage);
        refresh();
    };

    function clearForm() {
        $("input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    $scope.removeStorage = function (i) {
        console.log("Deleting storage", $scope.storages[i]);
        let r = confirm("¿Está seguro de eliminar este registro de almacén?");
        if (r) {
            deleteStorage($scope.storages[i]);
        } else {
            console.log("Storage not deleted");
        }
    };


    function getStorages() {
        $http.get("/api/v1/storages")
            .then(function (response) {
                console.log('Storages retrieved');
                $scope.storages = response.data;
            }, function (error) {
                console.log('Error retrieving storages', error);
                alert("Ups! Ha ocurrido un error al recuperar los registros de almacén, inténtalo de nuevo en unos minutos.");
            });
    }

    function postStorage(storage) {
        $http.post("/api/v1/storages", storage)
            .then(function (response) {
                console.log('Storage added', response);
                refresh();
            }, function (error) {
                console.log('Error adding storage', error);
                alert("Ups! Ha ocurrido un error al añadir el registro de almacén, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateStorage(storage) {
        $http.put("/api/v1/storages/" + storage._id, storage)
            .then(function (response) {
                console.log('Storage updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating storage', error);
                alert("Ups! Ha ocurrido un error al editar el registro de almacén, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteStorage(storage) {
        $http.delete("/api/v1/storages/" + storage._id)
            .then(function (response) {
                console.log('Storage deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating storage', error);
                alert("Ups! Ha ocurrido un error al eliminar el registro de almacén, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getStorages();
        clearForm();
        $scope.newStorage = {};
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Storages controller");
        getStorages();
        $scope.newStorage = {};
    }

    init();
});