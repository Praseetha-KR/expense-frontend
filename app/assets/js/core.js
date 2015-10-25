'use strict';

var app = angular.module('expenseApp', ['ngResource', '720kb.datepicker']);

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
            queryDate: function(dates) {
                return expenseResource.query({
                    date: dates
                }).$promise;
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
        $scope.expense.date = new Date();
        $scope.expense.category = 'Food';

        $scope.categories = {
            'travel': {
                name: 'Travel',
                icon: 'glyphicon-road'
            },
            'food': {
                name: 'Food',
                icon: 'glyphicon-cutlery'
            },
            'supermarket': {
                name: 'Supermarket',
                icon: 'glyphicon-shopping-cart'
            },
            'recharge': {
                name: 'Recharge',
                icon: 'glyphicon-phone'
            },
            'books': {
                name: 'Books',
                icon: 'glyphicon-book'
            },
            'entertainment': {
                name: 'Entertainment',
                icon: 'glyphicon-sunglasses'
            },
            'health': {
                name: 'Health',
                icon: 'glyphicon-plus'
            },
            'sports': {
                name: 'Sports',
                icon: 'glyphicon-heart-empty'
            },
            'gadgets': {
                name: 'Gadgets',
                icon: 'glyphicon-headphones'
            },
            'family': {
                name: 'Family',
                icon: 'glyphicon-home'
            },
            'web': {
                name: 'Web',
                icon: 'glyphicon-globe'
            },
            'conferences': {
                name: 'Conferences',
                icon: 'glyphicon-blackboard'
            }
        };

        $scope.toLower = function(str) {
            return str.toLowerCase();
        };
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
            expense.date = (new Date(expense.date)).getTime();
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

        $scope.durationFilter = 'today';
        $scope.today = new Date().toLocaleDateString('en-US');
        $scope.filterDay = function(day) {
            var start = (new Date(day)).getTime();
            var end = start + 86400000;
            ExpenseFactory.queryDate(new Array(start, end))
                .then(function(data) {
                    $scope.expenses = data;
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        $scope.filterDate = function(duration) {
            var start, end = new Date();
            var start_of_today = (new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0)).getTime();
            if (duration === 'today') {
                start = new Date(start_of_today);
            } else if (duration === 'yesterday') {
                start = new Date(start_of_today - 86400000);
                end = new Date(start_of_today);
            } else if (duration === 'week') {
                start = new Date(start_of_today - 604800000);
            } else if (duration === 'month') {
                start = new Date(start_of_today - 2629743000);
            } else if (duration === 'year') {
                start = new Date(start_of_today - 31556926000);
            } else {
                return;
            }

            ExpenseFactory.queryDate(new Array(start.getTime(), end.getTime()))
                .then(function(data) {
                    $scope.expenses = data;
                    console.log(data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
    }
]);
