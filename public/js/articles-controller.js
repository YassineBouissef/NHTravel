angular.module("MarmolistasElPilarApp").controller("ArticlesCtrl", function ($scope, $http, $location, $q) {
    $scope.inputs = [];
    $scope.alerts = [];
    $scope.event = '{ "id": 1, "eventTypeName": "Temperature", "value": 28.9 }';
    $scope.epl = '@NAME("Count-5") SELECT count(*) from Temperature#length_batch(5)';
    $scope.lol = "TEST";

    $scope.addEvent = function () {
        let event = {
            value: $scope.event,
            type: 'Event'
        };
        $scope.inputs.push(event);
        postInput(event);
    };

    $scope.addEPL = function () {
        let epl = {
            value: $scope.epl,
            type: 'EPL'
        };
        $scope.inputs.push(epl);
        postInput(epl);
    };

    function refresh() {
        console.log("Refreshing");
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