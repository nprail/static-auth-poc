angular
  .module("login", ["ui.router"])
  .config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state({
      name: "home",
      url: "/login?site&redirectUrl",
      controller: "LoginCtrl",
      templateUrl: "assets/login-page.html"
    });
  })
  .controller("LoginCtrl", function($scope, $transition$, $http) {
    var site = $transition$.params().site;
    var redirectUrl = $transition$.params().redirectUrl;

    $scope.login = function() {
      var data = {
        email: $scope.email,
        password: $scope.password,
        site: site,
        redirectUrl: redirectUrl
      };

      $http
        .post("/token", data)
        .then(function(res) {
          window.location.replace(res.data.redirect);
        })
        .catch(function(err) {
          console.log(err);
          $scope.error = err.data.message || err.data || err;
        });
    };
  });
