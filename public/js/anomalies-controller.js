angular.module("MarmolistasElPilarApp").controller("AnomaliesCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.anomalies = [];

    $scope.saveAnomaly = function () {
        console.log("Adding new anomaly", $scope.newAnomaly);
        postAnomaly($scope.newAnomaly);
           refresh();
    };

    function clearForm() {
        $("input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    $scope.removeAnomaly = function (i) {
        console.log("Deleting anomaly", $scope.anomalies[i]);
        let r = confirm("¿Está seguro de eliminar esta anomalía?");
        if (r) {
            deleteAnomaly($scope.anomalies[i]);
        } else {
            console.log("Anomaly not deleted");
        }
    };

    function getAnomalies() {
        $http.get("/api/v1/anomalies")
            .then(function (response) {
                console.log('Anomalies retrieved');
                $scope.anomalies = response.data;
            }, function (error) {
                console.log('Error retrieving anomalies', error);
                alert("Ups! Ha ocurrido un error al recuperar las anomalías, inténtalo de nuevo en unos minutos.");
            });
    }

    function postAnomaly(anomaly) {
        $http.post("/api/v1/anomalies", anomaly)
            .then(function (response) {
                console.log('Anomaly added', response);
                refresh();
            }, function (error) {
                console.log('Error adding anomaly', error);
                alert("Ups! Ha ocurrido un error al añadir la anomalía, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteAnomaly(anomaly) {
        $http.delete("/api/v1/anomalies/" + anomaly._id)
            .then(function (response) {
                console.log('Anomaly deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating anomaly', error);
                alert("Ups! Ha ocurrido un error al eliminar la anomalía, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getAnomalies();
        clearForm();
        $scope.newAnomaly = {};
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Anomalies controller");
        getAnomalies();
        $scope.newAnomaly = {};
    }

    init();
});