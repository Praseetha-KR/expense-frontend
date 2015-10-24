'use strict';

var app = angular.module('expenseApp', []);

app.controller('ExpenseController', [
    '$scope',
    function($scope) {
        $scope.hello = 'hello!';
    }
]);
