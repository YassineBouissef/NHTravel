angular.module("MarmolistasElPilarApp").controller("ProvidersCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.providers = [];

    $scope.saveProvider = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating provider", $scope.newProvider);
            postProvider($scope.newProvider);
        } else if ($scope.action === "Editar") {
            console.log("Updating provider", $scope.newProvider);
            updateProvider($scope.newProvider);
        }
        toggleForm();
    };

    function toggleForm() {
        $("form#addProviderForm label").each(function () {
            $(this).toggleClass('active');
        });
        $("form#addProviderForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addProviderForm label").each(function () {
            $(this).removeClass('active');
        });
        $("form#addProviderForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    function clearFilter() {
        $scope.filter_nombre = "";
        $scope.filter_cif = "";
        $scope.filter_telefono = "";
        $scope.filter_direccion = "";
        $("#search_cif").removeClass('valid');
        $("#search_name").removeClass('valid');
        $("#search_telefono").removeClass('valid');
        $("#search_direccion").removeClass('valid');
        $("#label_cif").removeClass('active');
        $("#label_name").removeClass('active');
        $("#label_telefono").removeClass('active');
        $("#label_direccion").removeClass('active');
    }

    $scope.editCustomer = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newProvider = $scope.providers[i];
        console.log("Editing provider", $scope.newProvider);
        toggleForm();
    };

    $scope.removeProvider = function (i) {
        console.log("Deleting provider", $scope.providers[i]);
        let r = confirm("¿Está seguro de eliminar este proovedor?\n" +
            "DNI: " + $scope.providers[i].cif + " | Nombre: " + $scope.providers[i].nombre);
        if (r) {
            deleteProvider($scope.providers[i]);
        } else {
            console.log("Provider not deleted");
        }
    };

    $scope.filterProvider = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_cif && !$scope.filter_telefono && !$scope.filter_direccion) return true;
        else if ($scope.filter_nombre && $scope.filter_dni && $scope.filter_telefono && $scope.filter_direccion) {
            // Filtrar por dni, nombre, telefono y direccion
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.cif.toLowerCase();
            let searchCode = $scope.filter_cif.toLowerCase();
            let telephone = item.telefono.toLowerCase();
            let searchTelephone =  $scope.filter_telefono.toLowerCase();
            let direction = item.direccion.toLowerCase();
            let searchDirection = $scope.filter_direccion.toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1 || telephone.indexOf(searchTelephone) > -1 ||  direction.indexOf(searchDirection) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_cif) {
            // Filtrar por cif
            let code = item.dni.toLowerCase();
            let search = $scope.filter_cif.toLowerCase();
            return code.indexOf(search) > -1;
        }
           else if ($scope.filter_telefono) {
            // Filtrar por dni
            let telephone = item.telefono.toLowerCase();
            let search = $scope.filter_telefono.toLowerCase();
            return telephone.indexOf(search) > -1;
        }
           else if ($scope.filter_direccion) {
            // Filtrar por dni
            let direction = item.direccion.toLowerCase();
            let search = $scope.filter_direccion.toLowerCase();
            return direction.indexOf(search) > -1;
        }
    };

    function getProviders() {
        $http.get("/api/v1/providers")
            .then(function (response) {
                console.log('Providers retrieved');
                $scope.providers = response.data;
            }, function (error) {
                console.log('Error retrieving providers', error);
                alert("Ups! Ha ocurrido un error al recuperar los proveedores, inténtalo de nuevo en unos minutos.");
            });
    }

    function postProvider(provider) {
        $http.post("/api/v1/providers", provider)
            .then(function (response) {
                console.log('Provider added', response);
                refresh();
            }, function (error) {
                console.log('Error adding provider', error);
                alert("Ups! Ha ocurrido un error al añadir el proveedor, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateProvider(provider) {
        $http.put("/api/v1/providers/" + provider._id, provider)
            .then(function (response) {
                console.log('Provider updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating provider', error);
                alert("Ups! Ha ocurrido un error al editar el proveedor, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteProvider(provider) {
        $http.delete("/api/v1/providers/" + provider._id)
            .then(function (response) {
                console.log('Provider deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating provider', error);
                alert("Ups! Ha ocurrido un error al eliminar el proveedor, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getProviders();
        clearForm();
        clearFilter();
        $scope.newProvider = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Articles controller");
        getProviders();
        $scope.newProvider = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});