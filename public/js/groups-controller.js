angular.module("MarmolistasElPilarApp").controller("GroupsCtrl", function ($scope, $http, $location, $q) {

    let index = -1;
    $scope.groups = [];

    $scope.saveGroup = function () {
        if ($scope.action === "Añadir") {
            console.log("Creating group", $scope.newGroup);
            postGroup($scope.newGroup);
        } else if ($scope.action === "Editar") {
            console.log("Updating group", $scope.newGroup);
            updateGroup($scope.newGroup);
        }
        toggleForm();
    };

    function toggleForm() {
        $("form#addGrupoForm label").each(function () {
            $(this).toggleClass('active');
        });
        $("form#addGrupoForm :input").each(function () {
            $(this).toggleClass('valid' || 'invalid');
        });
    }

    function clearForm() {
        $("form#addGrupoForm label").each(function () {
            $(this).removeClass('active');
        });
        $("form#addGrupoForm :input").each(function () {
            $(this).removeClass('valid' || 'invalid');
        });
    }

    function clearFilter() {
        $scope.filter_nombre = "";
        $("#search_name").removeClass('valid');
        $("#label_name").removeClass('active');
    }


    $scope.editGroup = function (i) {
        index = i;
        $scope.action = "Editar";
        $scope.icon_action = "edit";
        $scope.class_button = "btn-large waves-effect waves-light orange";
        $scope.newGroup = $scope.groups[i];
        $('#grupo').find('option[value="' + $scope.newGroup.grupo + '"]').prop('selected', true);
        $("#grupo").formSelect();
        console.log("Editing group", $scope.newGroup);
        toggleForm();
    };

    $scope.removeGroup = function (i) {
        console.log("Deleting group", $scope.groups[i]);
        let r = confirm("¿Está seguro de eliminar este grupo?\n" +
            " Nombre: " + $scope.groups[i].nombre);
        if (r) {
            deleteGroup($scope.groups[i]);
        } else {
            console.log("Group not deleted");
        }
    };

    $scope.filterGroup = function (item) {
        if (!$scope.filter_nombre) return true;
        else if ($scope.filter_nombre) {
            // Filtrar por codigo y nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        } else if ($scope.filter_nombre) {
            // Filtrar por nombre
            let text = item.nombre.toLowerCase();
            let search = $scope.filter_nombre.toLowerCase();
            return text.indexOf(search) > -1;
        }
    };

    function getGroups() {
        $http.get("/api/v1/groups")
            .then(function (response) {
                console.log('Groups retrieved');
                $scope.groups = response.data;
            }, function (error) {
                console.log('Error retrieving groups', error);
                alert("Ups! Ha ocurrido un error al recuperar los grupos, inténtalo de nuevo en unos minutos.");
            });
    }

    function postGroup(g) {
        $http.post("/api/v1/groups", g)
            .then(function (response) {
                console.log('Group added', response);
                refresh();
            }, function (error) {
                console.log('Error adding group', error);
                alert("Ups! Ha ocurrido un error al añadir el grupo, inténtalo de nuevo en unos minutos.");
            });
    }

    function updateGroup(g) {
        $http.put("/api/v1/groups/" + g._id, g)
            .then(function (response) {
                console.log('Group updated', response);
                refresh();
            }, function (error) {
                console.log('Error updating group', error);
                alert("Ups! Ha ocurrido un error al editar el grupo, inténtalo de nuevo en unos minutos.");
            });
    }

    function deleteGroup(g) {
        $http.delete("/api/v1/groups/" + g._id)
            .then(function (response) {
                console.log('Group deleted', response);
                refresh();
            }, function (error) {
                console.log('Error updating group', error);
                alert("Ups! Ha ocurrido un error al eliminar el grupo, inténtalo de nuevo en unos minutos.");
            });
    }

    function refresh() {
        console.log("Refreshing");
        getGroups();
        clearForm();
        clearFilter();
        $('#grupo').find('option[value="0"]').prop('selected', true);
        $("#grupo").formSelect();
        $scope.newGroup = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    $scope.refresh = function () {
        refresh();
    };

    function init() {
        console.log("Starting Groups controller");
        getGroups();
        $scope.newGroup = {};
        $scope.action = "Añadir";
        $scope.icon_action = "add";
        $scope.class_button = "btn-large waves-effect waves-light green";
    }

    init();
});