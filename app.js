(function() {
    angular.module('restaurantApp', ['ngRoute'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/signUp', {
                    templateUrl: 'signUp.html',
                    controller: 'SignUpController as signUpCtrl'
                })
                .when('/myInfo', {
                    templateUrl: 'myInfo.html',
                    controller: 'MyInfoController as myInfoCtrl'
                })
                .otherwise({
                    redirectTo: '/signUp'
                });
        })
        .controller('MainController', function($location) {
            this.goTo = function(path) {
                $location.path('/' + path);
            };
        })
        .controller('SignUpController', function($http, $location) {
            var self = this;
            self.user = {};
            self.invalidMenuNumber = false;
            self.saved = false;

            self.checkMenuItem = function() {
                if (self.user.menuNumber) {
                    var url = `https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json`;
                    $http.get(url).then(function(response) {
                        var menuItems = response.data;
                        var found = Object.keys(menuItems).some(category => {
                            return menuItems[category].menu_items.some(item => item.short_name === self.user.menuNumber);
                        });
                        self.invalidMenuNumber = !found;
                    });
                }
            };

            self.submitForm = function() {
                if (self.invalidMenuNumber) return;

                // Save the user info (mocked here as a simple assignment)
                localStorage.setItem('userInfo', JSON.stringify(self.user));
                self.saved = true;
                $location.path('/myInfo');
            };
        })
        .controller('MyInfoController', function($http) {
            var self = this;
            self.user = JSON.parse(localStorage.getItem('userInfo')) || null;
            self.menuItem = null;

            if (self.user && self.user.menuNumber) {
                var url = `https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json`;
                $http.get(url).then(function(response) {
                    var menuItems = response.data;
                    Object.keys(menuItems).forEach(category => {
                        menuItems[category].menu_items.forEach(item => {
                            if (item.short_name === self.user.menuNumber) {
                                self.menuItem = item;
                            }
                        });
                    });
                });
            }
        });
})();
