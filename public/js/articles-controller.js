angular.module("MarmolistasElPilarApp").controller("ArticlesCtrl", function ($scope, $http, $location, $q) {

    $scope.nuevaEncimera = {};

    $scope.crearEncimera = function () {
        console.log("Creando nueva encimera", $scope.nuevaEncimera);
    };

    function refresh() {
        console.log("Refreshing");
        $scope.nuevaEncimera = {};
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

    refresh();
});