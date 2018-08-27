angular.module("NHTravelApp").controller("BillsCtrl", function ($scope, $http, $location, $q) {
    
    $scope.round = function (amount) {
        return round(amount);
    };

    function round(amount) {
        return Math.round(amount * 100) / 100;
    }

    $scope.addItem = function () {
        console.log("Adding casa", $scope.newItem);
        $scope.newItem.casa = $scope.selectedItem;
        toggleForm();
        $scope.items.push($scope.newItem);
        $('.modal').modal('close');
        $scope.newItem = {};
    };


    $scope.addCustomItem = function () {
        console.log("Adding custom item", $scope.newCustomItem);
        if ($scope.newCustomItem) {
            $scope.items.push($scope.newCustomItem);
            $scope.newCustomItem = {};
        } else {
            alert("Ups! Escribe algún texto para añadirlo.");
        }
    };

    function toggleForm() {
        $("form#addItemForm :input").each(function () {
            $(this).removeClass('valid').removeClass('invalid');
        });
    }

    $scope.setSelectedItem = function (i) {
        console.log("Setting item", $scope.houses[i]);
        $scope.selectedItem = $scope.houses[i];
        $('.modal').modal('open');
    };

    function getHouses() {
        $http.get("/api/v1/houses")
            .then(function (response) {
                console.log('Houses retrieved');
                $scope.houses = response.data;
            }, function (error) {
                console.log('Error retrieving houses', error);
                alert("Ups! Ha ocurrido un error al recuperar las casas, inténtalo de nuevo en unos minutos.");
            });
    }

    function getType() {
        let type = $scope.bill.tipo;
        switch (+type) {
            case 0:
                $scope.tipoText = "Presupuesto";
                break;
            case 1:
                $scope.tipoText = "Factura";
                break;
        }
    }

    $scope.removeItem = function (i) {
        console.log("Deleting item", $scope.items[i]);
        let r = confirm("¿Está seguro de eliminar este artículo de la lista?");
        if (r) {
            $scope.items.splice(i, 1);
        } else {
            console.log("Item not deleted");
        }
    };

    $scope.filterHome = function (item) {
        if (!$scope.filter_nombre && !$scope.filter_codigo) return true;
        else if ($scope.filter_nombre && $scope.filter_codigo) {
            // Filtrar por codigo y nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            let code = item.codigo.toString().toLowerCase();
            let searchCode = $scope.filter_codigo.toString().toLowerCase();
            return text.indexOf(search) > -1 || code.indexOf(searchCode) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_codigo) {
            // Filtrar por código
            let code = item.codigo.toString().toLowerCase();
            let search = $scope.filter_codigo.toString().toLowerCase();
            return code.indexOf(search) > -1;
        }
    };

    $scope.getTotal = function (aux) {
        let total = 0;
        $scope.items.forEach((item) => {
            if (item.hasOwnProperty("total"))
                total += item.total;
        });
        return round(total * aux);
    };

    $scope.getTotalAmount = function () {
        if ($scope.bill.pagado)
            return $scope.getTotal(1);
    };

    $scope.saveDocument = function (type) {
        $scope.bill.items = $scope.items;
        $scope.bill.total = $scope.getTotalAmount();
        if (type === $scope.bill.tipo) {
            //UPDATE
            $scope.bill.tipo = type;
            console.log($scope.bill);
            updateBill($scope.bill);
        } else {
            //CREATE
            delete $scope.bill._id;
            $scope.bill.fecha = new Date();
            $scope.bill.tipo = type;
            console.log($scope.bill);
            postBill($scope.bill);
        }
    };

    function updateBill(bill) {
        $http.put("/api/v1/bills/" + bill._id, bill)
            .then(function (response) {
                console.log('Bill updated', response);
                alert('GENERAR WORD');
                alert('VOLVER A LA PANTALLA ANTERIOR');
                window.location.href = '/clientes/' + $scope.bill.cliente._id;
            }, function (error) {
                console.log('Error updating bill', error);
                alert("Ups! Ha ocurrido un error al editar el documento, inténtalo de nuevo en unos minutos.");
            });
    }


    function postBill(bill) {
        $http.get("/api/v1/bills/type/" + bill.tipo)
            .then(function (response) {
                let bills = response.data;
                bill.codigo = bills.length > 0 ? bills[bills.length -1 ].codigo +1 : 1;
                $http.post("/api/v1/bills", bill)
                    .then(function (response) {
                        console.log('Bill added', response);
                        alert('GENERAR WORD');
                        window.location.href = '/clientes/' + $scope.bill.cliente._id;
                    }, function (error) {
                        console.log('Error adding bill', error);
                        alert("Ups! Ha ocurrido un error al crear el documento, inténtalo de nuevo en unos minutos.");
                    });
            }, function (error) {
                console.log('Error adding bill', error);
                alert("Ups! Ha ocurrido un error al crear el documento, inténtalo de nuevo en unos minutos.");
            });
    }

    function getClient(id) {
        $http.get("/api/v1/clients/" + id)
            .then(function (response) {
                console.log('Client retrieved', response.data[0]);
                $scope.cliente = response.data[0];
                if ($scope.modo === 'add') {
                    $scope.bill.formadepago = $scope.cliente.formadepago;
                    setTimeout(function () {
                        $('select#formadepago').prop('selectedIndex', $scope.cliente.formadepago);
                        $('#formadepago').formSelect();
                    }, 500);
                    $scope.bill.pagado = !!$scope.cliente.pagado;
                    $scope.bill.cliente = $scope.cliente;
                }
            }, function (error) {
                console.log('Error retrieving cliente', error);
                alert("Ups! Ha ocurrido un error al recuperar los datos del cliente, inténtalo de nuevo en unos minutos.");
            });
    }

    function getBill(id) {
        $http.get("/api/v1/bills/" + id)
            .then(function (response) {
                console.log('Bill retrieved', response.data[0]);
                $scope.bill = response.data[0];
                setTimeout(function () {
                    $('select#formadepago').prop('selectedIndex', $scope.bill.formadepago);
                    $('#formadepago').formSelect();
                }, 500);
                $scope.items = $scope.bill.items;
                getType();
                getClient($scope.bill.cliente._id);
            }, function (error) {
                console.log('Error retrieving cliente', error);
                alert("Ups! Ha ocurrido un error al recuperar los datos del cliente, inténtalo de nuevo en unos minutos.");
            });
    }


    function init() {
        console.log("Starting Bills controller");
        $scope.selectedItem = {};
        $scope.houses = [];
        $scope.items = [];
        $scope.bill = {};
        $scope.newItem = {};
        getHouses();
        let url = window.location.href;
        $scope.modo = (url.includes('crear') ? 'add' : 'edit');
        console.log('Modo: ', $scope.modo);
        $scope.id = url.substr(url.lastIndexOf("/") + 1, url.length);
        console.log($scope.id);
        if ($scope.modo === 'add')
            getClient($scope.id);
        else
            getBill($scope.id)
    }

    init();
});