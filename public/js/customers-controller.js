angular.module("MarmolistasElPilarApp").controller("CustomersCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.customers = [];
    $scope.formadepagos = [
        {
            _id: "0",
            nombre: "50/50",
            selected: true
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Tarjeta"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Efectivo"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Cheque"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "30 días"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "60 días"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Pagaré"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Confirming"
        },
        {
            _id: "5g573fc815249c4010458d15",
            nombre: "Trasnferencia"
        }];

    $scope.tarifas = [
        {
            _id: "0",
            nombre: "General",
            selected: true
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Encimeras"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Contratistas"
        },
        {
            _id: "5g533fc815249c4010458d15",
            nombre: "Público"
        }];

    $scope.saveCustomer = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating customer", $scope.newCustomer);
            postCustomer($scope.newCustomer);
        } else if ($scope.action === "Editar") {
            console.log("Updating customer", $scope.newCustomer);
            updateCustomer($scope.newCustomer);
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
        $("#search_telefono").removeClass('valid');
        $("#search_direccion").removeClass('valid');
        $("#label_dni").removeClass('active');
        $("#label_name").removeClass('active');
        $("#label_telefono").removeClass('active');
        $("#label_direccion").removeClass('active');
    }

    $scope.editCustomer = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newCustomer = $scope.customers[i];
        $('#formadepago').find('option[value="' + $scope.newCustomer.formadepago + '"]').prop('selected', true);
        $("#formadepago").formSelect();
        $('#tarifa').find('option[value="' + $scope.newCustomer.tarifa + '"]').prop('selected', true);
        $("#tarifa").formSelect();
        console.log("Editing customer", $scope.newCustomer);
        toggleForm();
    };

    $scope.removeCustomer = function (i) {
        console.log("Deleting customer", $scope.customers[i]);
        let r = confirm("¿Está seguro de eliminar este cliente?\n" +
            "DNI: " + $scope.customers[i].dni + " | Nombre: " + $scope.customers[i].nombre);
        if (r) {
            deleteCustomer($scope.customers[i]);
        } else {
            console.log("Customer not deleted");
        }
    };

    $scope.filterCustomer = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_dni && !$scope.filter_telefono && !$scope.filter_direccion) return true;
        else if ($scope.filter_nombre && $scope.filter_dni && $scope.filter_telefono && $scope.filter_direccion) {
            // Filtrar por dni, nombre, telefono y direccion
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.dni.toLowerCase();
            let searchCode = $scope.filter_dni.toLowerCase();
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
        } else if ($scope.filter_dni) {
            // Filtrar por dni
            let code = item.dni.toLowerCase();
            let search = $scope.filter_dni.toLowerCase();
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

    function getCustomers() {
        $http.get("/api/v1/customers")
            .then(function (response) {
                console.log('Customers retrieved');
                $scope.customers = response.data;
            }, function (error) {
                console.log('Error retrieving customers', error);
                alert("Ups! Ha ocurrido un error al recuperar los clientes, inténtalo de nuevo en unos minutos.");
            });
    }

    function postCustomer(customer) {
        $http.post("/api/v1/customers", customer)
            .then(function (response) {
                console.log('Customer added', response);
                refresh();
            }, function (error) {
                console.log('Error adding customer', error);
                alert("Ups! Ha ocurrido un error al añadir el cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateCustomer(customer) {
        $http.put("/api/v1/customers/" + customer._id, customer)
            .then(function (response) {
                console.log('Customer updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating customer', error);
                alert("Ups! Ha ocurrido un error al editar el cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteCustomer(customer) {
        $http.delete("/api/v1/customers/" + customer._id)
            .then(function (response) {
                console.log('Customer deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating customer', error);
                alert("Ups! Ha ocurrido un error al eliminar el cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getCustomers();
        clearForm();
        clearFilter();
        $('#formadepago').find('option[value="0"]').prop('selected', true);
        $("#formadepago").formSelect();
        $('#tarifa').find('option[value="0"]').prop('selected', true);
        $("#tarifa").formSelect();
        $scope.newCustomer = {};
        $scope.newCustomer.formadepago = $scope.formadepagos[0]._id;
        $scope.newCustomer.tarifas = $scope.tarifas[0]._id;
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Articles controller");
        getCustomers();
        $scope.newCustomer = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});