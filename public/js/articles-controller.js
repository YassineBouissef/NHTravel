angular.module("MarmolistasElPilarApp").controller("ArticlesCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.articles = [];
    $scope.groups = [
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Grupo 1"
        },
        {
            _id: "5g573fc815249c4010458d15",
            nombre: "Grupo 2"
        }];

    $scope.saveArticle = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating article", $scope.newArticle);
            postArticle($scope.newArticle);
        } else if ($scope.action === "Editar") {
            console.log("Updating article", $scope.newArticle);
            updateArticle($scope.newArticle);
        }
        toggleForm();
    };

    function toggleForm() {
        $("form#addArticuloForm label").each(function () {
            $(this).toggleClass('active');
        });
        $("form#addArticuloForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addArticuloForm label").each(function () {
            $(this).removeClass('active');
        });
        $("form#addArticuloForm :input").each(function () {
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


    $scope.editArticle = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newArticle = $scope.articles[i];
        console.log("Editing article", $scope.newArticle);
        toggleForm();
    };

    $scope.removeArticle = function (i) {
        console.log("Deleting article", $scope.articles[i]);
        let r = confirm("¿Está seguro de eliminar este artículo?\n" +
            "Codigo: " + $scope.articles[i].codigo + " | Nombre: " + $scope.articles[i].nombre);
        if (r) {
            deleteArticle($scope.articles[i]);
        } else {
            console.log("Article not deleted");
        }
    };

    $scope.filterArticle = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_codigo) return true;
        else if ($scope.filter_nombre && $scope.filter_codigo) {
            // Filtrar por codigo y nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.codigo.toLowerCase();
            let searchCode = $scope.filter_codigo.toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_codigo) {
            // Filtrar por código
            let code = item.codigo.toLowerCase();
            let search = $scope.filter_codigo.toLowerCase();
            return code.indexOf(search) > -1;
        }
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

    function postArticle(article) {
        $http.post("/api/v1/articles", article)
            .then(function (response) {
                console.log('Article added', response);
                refresh();
            }, function (error) {
                console.log('Error adding article', error);
                alert("Ups! Ha ocurrido un error al añadir el artículo, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateArticle(article) {
        $http.put("/api/v1/articles/" + article._id, article)
            .then(function (response) {
                console.log('Article updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating article', error);
                alert("Ups! Ha ocurrido un error al editar el artículo, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteArticle(article) {
        $http.delete("/api/v1/articles/" + article._id)
            .then(function (response) {
                console.log('Article deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating article', error);
                alert("Ups! Ha ocurrido un error al eliminar el artículo, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getArticles();
        clearForm();
        clearFilter();
        $scope.newArticle = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Articles controller");
        getArticles();
        $scope.newArticle = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});