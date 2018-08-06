angular.module("MarmolistasElPilarApp").controller("BillsCtrl", function ($scope, $http, $location, $q) {
    let index;
    $scope.articles = [];
    $scope.items = [];

    function refresh() {
        console.log("Refreshing");
    }

    $scope.refresh = function () {
        refresh();
    };

    $scope.addArticle = function (i) {
        index = i;
        console.log("Adding article", $scope.articles[i]);
        let item = {articulo: $scope.articles[i]};
        item.unidades=5;
        item.cantidad=25;
        item.descuento=0;
        $scope.items.push(item);
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

    function init() {
        console.log("Starting Bills controller");
        getArticles();
        let url = window.location.href;
        $scope.userId = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.userId);
    }

    init();
});