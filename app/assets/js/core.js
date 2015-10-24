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
            query: function() {
                return expenseResource.query().$promise;
            },
            post: function(expense) {
                return expenseResource.save(expense).$promise;
            },
            get: function(id) {
                return expenseResource.get({id: id}).$promise;
            },
            patch: function(id, expense) {
                return expenseResource.update({id: id}, expense).$promise;
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
            ExpenseFactory.query()
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
        $scope.viewExpense = function(expenseId) {
            ExpenseFactory.get(expenseId)
                .then(function(data) {
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        $scope.updateExpense = function(expenseId, expense) {
            ExpenseFactory.patch(expenseId, expense)
                .then(function(data) {
                    $scope.viewExpense();
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
