angular.module("MarmolistasElPilarApp").controller("ArticlesCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.articles = [
        {
            "codigo": "1A3",
            "nombre": "Encimera",
            "iva": 21,
            "precio_costo": 125,
            "tarifa_general": 120,
            "tarifa_encimera": 125,
            "tarifa_contratista": 120,
            "tarifa_publico": 120,
            "unidad": "M2",
            "dimension": "50 * 50"
        },
        {
            "codigo": "BF13",
            "nombre": "Encimera",
            "iva": 21,
            "precio_costo": 25,
            "tarifa_general": 12,
            "tarifa_encimera": 58,
            "tarifa_contratista": 65,
            "tarifa_publico": 58,
            "unidad": "M2",
            "dimension": "45 * 45"
        }];

    $scope.saveArticle = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating article", $scope.newArticle);
            $scope.articles.push($scope.newArticle);
            postArticle($scope.newArticle);
        } else if ($scope.action === "Editar") {
            console.log("Updating article", $scope.newArticle);
            $scope.articles[index] = $scope.newArticle;
        }
        toggleForm();
        refresh();
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
            $scope.articles.splice(i, 1);
            console.log("Article deleted");
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
        $http.get("/articles")
            .then(function (response) {
            }, function (error) {
            });
    }

    function postArticle(article) {
        $http.post("/api/v1/articles", article)
            .then(function (response) {
                console.log('Article added', response);
            }, function (error) {
                console.log('Error adding article', error);
            });
    }

    function updateArticle(article) {
        $http.put("/articles/" + article._id, article)
            .then(function (response) {
            }, function (error) {
            });
    }

    function deleteArticle(article) {
        $http.delete("/articles/" + article._id)
            .then(function (response) {
            }, function (error) {
            });
    }

    function refresh() {
        console.log("Refreshing");
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
        $scope.newArticle = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});