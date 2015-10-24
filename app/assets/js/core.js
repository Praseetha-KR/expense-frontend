'use strict';

var app = angular.module('expenseApp', ['ngResource']);

app.config(function($httpProvider) {
    // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
});

app.factory('ExpenseFactory', [
    '$resource',
    function($resource) {
        var expenseResource = $resource('http://localhost:8080/api/expenses/:id', null, {
            'update': {
                method: 'PATCH',
                params: {id: '@id'}
            }
        }, {
            stripTrailingSlashes: false
        });

        return {
            get: function() {
                return expenseResource.query().$promise;
            },
            post: function(expense) {
                return expenseResource.save(expense).$promise;
            },
            delete: function(id) {
                return expenseResource.delete({id: id}).$promise;
            }
        };
    }
]);
app.controller('ExpenseController', [
    '$scope',
    'ExpenseFactory',
    function($scope, ExpenseFactory) {
        $scope.expense = {};

        $scope.expenses = {};
        function loadExpenses() {
            ExpenseFactory.get()
                .then(function(data) {
                    $scope.expenses = data;
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        loadExpenses();
        $scope.createExpense = function(expense) {
            expense.date = new Date();
            ExpenseFactory.post(expense)
                .then(function(data) {
                    loadExpenses();
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        $scope.removeExpense = function(expenseId) {
            ExpenseFactory.delete(expenseId)
                .then(function(data) {
                    loadExpenses();
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
    }
]);
