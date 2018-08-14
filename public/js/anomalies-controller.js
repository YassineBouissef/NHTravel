angular.module("MarmolistasElPilarApp").controller("AnomaliesCtrl", function ($scope, $http, $location, $q) {

    let d = new Date();
    let today = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    let now = ("0" + (d.getHours())).slice(-2) + ':' + ("0" + (d.getMinutes())).slice(-2);
    $scope.anomalies = [];

    $scope.saveAnomaly = function () {
        console.log("Adding new anomaly", $scope.newAnomaly);
        postAnomaly($scope.newAnomaly);
    };

    $scope.anomalyDone = function (i) {
        console.log("Marking anomaly as done", $scope.anomalies[i]);
        $scope.anomalies[i].terminada = true;
        updateAnomaly($scope.anomalies[i]);
    };

    function updateAnomaly(anomaly) {
        $http.put("/api/v1/anomalies/" + anomaly._id, anomaly)
            .then(function (response) {
                console.log('Anomaly updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating anomaly', error);
                alert("Ups! Ha ocurrido un error al marca la anomalía como lista, inténtalo de nuevo en unos minutos.");
            });
    }

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
        $scope.newAnomaly.terminada = false;
        $scope.newAnomaly.fecha = today;
        $scope.newAnomaly.hora = now;
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Anomalies controller");
        getAnomalies();
        $scope.newAnomaly = {};
        $scope.newAnomaly.terminada = false;
        $scope.newAnomaly.fecha = today;
        $scope.newAnomaly.hora = now;
    }

    init();
});