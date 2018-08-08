angular.module("MarmolistasElPilarApp").controller("ClientsCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.clients = [];
    $scope.formadepagos = [
        {
            _id: 0,
            nombre: "50/50",
            selected: true
        },
        {
            _id: 1,
            nombre: "Tarjeta"
        },
        {
            _id: 2,
            nombre: "Efectivo"
        },
        {
            _id: 3,
            nombre: "Cheque"
        },
        {
            _id: 4,
            nombre: "30 días"
        },
        {
            _id: 5,
            nombre: "60 días"
        },
        {
            _id: 6,
            nombre: "Pagaré"
        },
        {
            _id: 7,
            nombre: "Confirming"
        }];

    $scope.tarifas = [
        {
            _id: 0,
            nombre: "General",
            selected: true
        },
        {
            _id: 1,
            nombre: "Encimeras"
        },
        {
            _id: 2,
            nombre: "Contratistas"
        },
        {
            _id: 3,
            nombre: "Público"
        }];

    $scope.saveClient = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating client", $scope.newClient);
            postClient($scope.newClient);
        } else if ($scope.action === "Editar") {
            console.log("Updating client", $scope.newClient);
            updateClient($scope.newClient);
        }
        toggleForm();
    };

    function toggleForm() {
        $("form#addClienteForm label").each(function () {
            $(this).toggleClass('active');
        });
        $("form#addClienteForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addClienteForm label").each(function () {
            $(this).removeClass('active');
        });
        $("form#addClienteForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    function clearFilter() {
        $scope.filter_nombre = "";
        $scope.filter_dni = "";
        $scope.filter_telefono = "";
        $scope.filter_direccion = "";
        $("#search_dni").removeClass('valid');
        $("#search_name").removeClass('valid');
        $("#search_phone").removeClass('valid');
        $("#search_adress").removeClass('valid');
        $("#label_dni").removeClass('active');
        $("#label_name").removeClass('active');
        $("#label_phone").removeClass('active');
        $("#label_adress").removeClass('active');
    }

    $scope.editClient = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newClient = $scope.clients[i];
        $('#formadepago').find('option[value="' + $scope.newClient.formadepago + '"]').prop('selected', true);
        $("#formadepago").formSelect();
        $('#tarifa').find('option[value="' + $scope.newClient.tarifa + '"]').prop('selected', true);
        $("#tarifa").formSelect();
        console.log("Editing client", $scope.newCustomer);
        toggleForm();
    };

    $scope.removeClient = function (i) {
        console.log("Deleting client", $scope.clients[i]);
        let r = confirm("¿Está seguro de eliminar este cliente?\n" +
            "DNI: " + $scope.clients[i].dni + " | Nombre: " + $scope.clients[i].nombre);
        if (r) {
            deleteClient($scope.clients[i]);
        } else {
            console.log("Client not deleted");
        }
    };

    $scope.filterClient = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_dni && !$scope.filter_telefono && !$scope.filter_direccion) return true;
        else if ($scope.filter_nombre && $scope.filter_dni && $scope.filter_telefono && $scope.filter_direccion) {
            // Filtrar por dni, nombre, telefono y direccion
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.dni.toLowerCase();
            let searchCode = $scope.filter_dni.toLowerCase();
            let phone = item.telefono.toLowerCase();
            let searchPhone = $scope.filter_telefono.toLowerCase();
            let address = item.domicilio.toLowerCase();
            let searchAddress = $scope.filter_direccion.toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1 || phone.indexOf(searchPhone) > -1 || address.indexOf(searchAddress) > -1;
        } else if ($scope.filter_nombre) {
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_dni) {
            let code = item.dni.toLowerCase();
            let search = $scope.filter_dni.toLowerCase();
            return code.indexOf(search) > -1;
        } else if ($scope.filter_telefono) {
            let phone = item.telefono.toString();
            let search = $scope.filter_telefono.toString();
            return phone.indexOf(search) > -1;
        } else if ($scope.filter_direccion) {
            let address = item.domicilio.toLowerCase();
            let location = item.poblacion.toLowerCase();
            let state = item.provincia.toLowerCase();
            let search = $scope.filter_direccion.toLowerCase();
            return address.indexOf(search) > -1 || location.indexOf(search) > -1 || state.indexOf(search) > -1;
        }
    };

    function getClients() {
        $http.get("/api/v1/clients")
            .then(function (response) {
                console.log('Clients retrieved');
                $scope.clients = response.data;
            }, function (error) {
                console.log('Error retrieving clients', error);
                alert("Ups! Ha ocurrido un error al recuperar los clientes, inténtalo de nuevo en unos minutos.");
            });
    }

    function postClient(client) {
        $http.post("/api/v1/clients", client)
            .then(function (response) {
                console.log('Client added', response);
                refresh();
            }, function (error) {
                console.log('Error adding client', error);
                alert("Ups! Ha ocurrido un error al añadir el cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateClient(client) {
        $http.put("/api/v1/clients/" + client._id, client)
            .then(function (response) {
                console.log('Client updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating client', error);
                alert("Ups! Ha ocurrido un error al editar el cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteClient(client) {
        $http.delete("/api/v1/clients/" + client._id)
            .then(function (response) {
                console.log('Client deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating client', error);
                alert("Ups! Ha ocurrido un error al eliminar el cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getClients();
        clearForm();
        clearFilter();
        $('select#formadepago').prop('selectedIndex', 1);
        $('select#tarifa').prop('selectedIndex', 1);
        $('select').formSelect();
        $scope.newClient = {};
        $scope.newClient.formadepago = $scope.formadepagos[0]._id;
        $scope.newClient.tarifa = $scope.tarifas[0]._id;
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Clients controller");
        getClients();
        $scope.newClient = {};
        $scope.newClient.formadepago = $scope.formadepagos[0]._id;
        $scope.newClient.tarifa = $scope.tarifas[0]._id;
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});