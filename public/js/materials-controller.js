angular.module("MarmolistasElPilarApp").controller("MaterialsCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.materials = [];

    $scope.saveMaterial = function () {
        console.log("Adding new material", $scope.newMaterial);
        postMaterial($scope.newMaterial);
           refresh();
    };

    function clearForm() {
        $("input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    $scope.removeMaterial = function (i) {
        console.log("Deleting material", $scope.materials[i]);
        let r = confirm("¿Está seguro de eliminar esta reserva de material?");
        if (r) {
            deleteMaterial($scope.materials[i]);
        } else {
            console.log("Material not deleted");
        }
    };

    function getMaterials() {
        $http.get("/api/v1/materials")
            .then(function (response) {
                console.log('Materials retrieved');
                $scope.materials = response.data;
            }, function (error) {
                console.log('Error retrieving materials', error);
                alert("Ups! Ha ocurrido un error al recuperar las reservas de material, inténtalo de nuevo en unos minutos.");
            });
    }

    function postMaterial(material) {
        $http.post("/api/v1/materials", material)
            .then(function (response) {
                console.log('Material added', response);
                refresh();
            }, function (error) {
                console.log('Error adding material', error);
                alert("Ups! Ha ocurrido un error al añadir la reserva de material, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteMaterial(material) {
        $http.delete("/api/v1/materials/" + material._id)
            .then(function (response) {
                console.log('Material deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating material', error);
                alert("Ups! Ha ocurrido un error al eliminar la reserva de material, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getMaterials();
        clearForm();
        $scope.newMaterial = {};
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Materials controller");
        getMaterials();
        $scope.newMaterial = {};
    }

    init();
});