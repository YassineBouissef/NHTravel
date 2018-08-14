angular.module("MarmolistasElPilarApp").controller("ChecksCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.checks = [];

    $scope.saveCheck = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating check", $scope.newCheck);
            $scope.newCheck.tipo = +$scope.newCheck.tipo;
            postCheck($scope.newCheck);
        } else if ($scope.action === "Editar") {
            console.log("Updating check", $scope.newCheck);
            updateCheck($scope.newCheck);
        }
        toggleForm();
    };

    function toggleForm() {
        $("form#addCheckForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addCheckForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    function clearFilter() {
        $scope.filter_nombre = "";
        $scope.filter_codigo = "";
        $scope.filter_importe = "";
        $("#search_amount").removeClass('valid');
        $("#search_name").removeClass('valid');
        $("#search_code").removeClass('valid');
        $("#label_amount").removeClass('active');
        $("#label_name").removeClass('active');
        $("#label_code").removeClass('active');
    }

    $scope.editCheck = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newCheck = $scope.checks[i];
        setTimeout(function () {
            $('#tipo').find('option[value="' + $scope.newCheck.tipo + '"]').prop('selected', true);
            $('#tipo').formSelect();
        }, 500);
        console.log("Editing check", $scope.newCheck);
        toggleForm();
    };

    $scope.removeCheck = function (i) {
        console.log("Deleting check", $scope.checks[i]);
        let r = confirm("¿Está seguro de eliminar este cheque/pagarés?");
        if (r) {
            deleteCheck($scope.checks[i]);
        } else {
            console.log("Check not deleted");
        }
    };

    $scope.filterCheck = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_codigo && !$scope.filter_importe) return true;
        else if ($scope.filter_nombre && $scope.filter_codigo && $scope.filter_importe) {
            // Filtrar por nombre, código e importe
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.codigo.toString().toLowerCase();
            let searchCode = $scope.filter_codigo.toString().toLowerCase();
            let amount = item.importe.toString().toLowerCase();
            let searchAmount = $scope.filter_importe.toString().toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1 || amount.indexOf(searchAmount) > -1;
        } else if ($scope.filter_nombre) {
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_codigo) {
            let code = item.codigo.toString().toLowerCase();
            let searchCode = $scope.filter_codigo.toString().toLowerCase();
            return code.indexOf(searchCode) > -1;
        } else if ($scope.filter_importe) {
            let amount = item.importe.toString().toLowerCase();
            let searchAmount = $scope.filter_importe.toString().toLowerCase();
            return amount.indexOf(searchAmount) > -1
        }
    };

    function getChecks() {
        $http.get("/api/v1/checks")
            .then(function (response) {
                console.log('Checks retrieved');
                $scope.checks = response.data;
                $scope.newCheck.codigo = $scope.checks.length > 0 ? $scope.checks[$scope.checks.length - 1].codigo + 1 : 1;
            }, function (error) {
                console.log('Error retrieving checks', error);
                alert("Ups! Ha ocurrido un error al recuperar los cheques y pagarés, inténtalo de nuevo en unos minutos.");
            });
    }

    function postCheck(check) {
        $http.post("/api/v1/checks", check)
            .then(function (response) {
                console.log('Check added', response);
                refresh();
            }, function (error) {
                console.log('Error adding check', error);
                alert("Ups! Ha ocurrido un error al añadir el cheque/pagarés, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateCheck(check) {
        $http.put("/api/v1/checks/" + check._id, check)
            .then(function (response) {
                console.log('Check updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating check', error);
                alert("Ups! Ha ocurrido un error al editar el cheque/pagarés, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteCheck(check) {
        $http.delete("/api/v1/checks/" + check._id)
            .then(function (response) {
                console.log('Check deleted', response);
                refresh();
            }, function (error) {
                console.log('Error deleting check', error);
                alert("Ups! Ha ocurrido un error al eliminar el cheque/pagaré, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getChecks();
        clearForm();
        clearFilter();
        $scope.newCheck = {};
        $scope.newCheck.tipo = 0;
        let d = new Date();
        $scope.newCheck.fecha = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.newCheck.fecha_vencimiento = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Checks controller");
        getChecks();
        $scope.newCheck = {};
        $scope.newCheck.tipo = 0;
        let d = new Date();
        $scope.newCheck.fecha = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.newCheck.fecha_vencimiento = ("0" + (d.getDate())).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});